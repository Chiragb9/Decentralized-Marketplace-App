const Marketplace = artifacts.require('./Marketplace.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()
    
contract("Marketplace",([deployer, seller, buyer])=>{
    let marketplace

    before(async()=>{
        marketplace = await Marketplace.deployed()
    })

    describe("deployment",async()=>{
        it("deploys successfully",async()=>{
            const address = await marketplace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })

        it("has a name",async()=>{
            const name = await marketplace.name()
            assert.equal(name,"Chirag")
        })
    })

    describe("products",async()=>{
        let product, productCount;

        before(async()=>{
        product = await marketplace.createProduct("iPhone X", web3.utils.toWei('1','ether'),{ from: seller });
        productCount = await marketplace.productCount();
        })

       it("Creates a product", async()=>{

           //SUCCESS
           assert.equal(productCount,1);
           const event = product.logs[0].args;
           assert.equal(event.id.toNumber(),productCount.toNumber(),"has an id");
           assert.equal(event.name,"iPhone X","has a name");
           assert.equal(event.price,1000000000000000000,"has a price");
           assert.equal(event.owner,seller,"has a owner");
           assert.equal(event.purchased,false,"has a purchased");

           //FAILURE
           await await marketplace.createProduct("", web3.utils.toWei('1','ether'),{ from: seller }).should.be.rejected;
           await await marketplace.createProduct("iPhone X", 0 ,{ from: seller }).should.be.rejected;
       })


       it("lists products", async()=>{
        const products = await marketplace.products(productCount);
        //SUCCESS
        assert.equal(products.id.toNumber(),productCount.toNumber(),"has an id");
        assert.equal(products.name,"iPhone X","has a name");
        assert.equal(products.price,1000000000000000000,"has a price");
        assert.equal(products.owner,seller,"has a owner");
        assert.equal(products.purchased,false,"has a purchased");

        })

        it("sells product", async()=>{

            let oldSellerPrice = await web3.eth.getBalance(seller);
            oldSellerPrice = new web3.utils.BN(oldSellerPrice);

            const result = await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('1','ether')})
            const event = result.logs[0].args;

            //SUCCESS
           assert.equal(event.id.toNumber(),productCount.toNumber(),"has an id");
           assert.equal(event.name,"iPhone X","has a name");
           assert.equal(event.price,1000000000000000000,"has a price");
           assert.equal(event.owner,buyer,"has a owner");
           assert.equal(event.purchased,true,"has a purchased");

            let newSellerBalance = await web3.eth.getBalance(seller);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price = web3.utils.toWei('1','ether');
            price = new web3.utils.BN(price);

            const expectedBalance = oldSellerPrice.add(price);

            assert.equal(expectedBalance.toString(),newSellerBalance.toString());

            //FAILURE
            //invalid ID
            await marketplace.purchaseProduct(99,{from: buyer, value: web3.utils.toWei('1','ether')}).should.be.rejected;
            //Not enough price
            await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('0.5','ether')}).should.be.rejected;
            //no one can buy the product twice 
            await marketplace.purchaseProduct(productCount,{from: deployer, value: web3.utils.toWei('1','ether')}).should.be.rejected;
            //seller can't buy the product again
            await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('1','ether')}).should.be.rejected;


        })
    })



})

