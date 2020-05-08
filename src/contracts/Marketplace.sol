pragma solidity >=0.4.21 <0.6.7;

contract Marketplace{
    string public name;
    uint public productCount;
    mapping(uint=>Product) public products;

    event productCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event productPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }


    constructor() public{
        name = "Chirag";
    }

    function createProduct(string memory _name, uint _price) public {
    //Adding require statements
    require(bytes(_name).length > 0, "Name of the product required ");
    require(_price > 0, "Price of the product required");
    //increment the product count
    productCount++;
    //create a new product and map it
    products[productCount] = Product(productCount,_name,_price,msg.sender,false);
    //emit the product created event
    emit productCreated(productCount,_name,_price,msg.sender,false);

    }

    function purchaseProduct(uint _id) public payable {
    //make the local copy of the product from the blockchain in the memory
    Product memory _product = products[_id];
    //Assign product owner to a payable address _seller
    address payable _seller = _product.owner;
    //make sure product id is valid
    require(_id>0 && _id<=productCount, "Invalid Product Id");
    //make sure product is not purchased before
    require(!_product.purchased,"Product is already purchased");
    //make sure seller is not the buyer
    require(msg.sender != _seller,"Seller can't by the product");
    //make sure buyer pays required price
    require(msg.value>=_product.price,"Not enough money");
    //change the owner
    _product.owner = msg.sender;
    //mark the product as purchased
    _product.purchased = true;
    //update the product in the blockchain
    products[_id] = _product;
    //transfer the ether to the seller
    address(_seller).transfer(msg.value);
    //emit the event productCreated
    emit productPurchased(productCount, _product.name, _product.price,msg.sender, true);
    }



}