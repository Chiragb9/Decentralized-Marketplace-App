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
    })



})

