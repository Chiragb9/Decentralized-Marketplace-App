pragma solidity >=0.4.21 <0.6.7;

contract Marketplace{
    string public name;
    uint public productCount;
    mapping(uint=>Product) public products;

    event productCreated(
        uint id,
        string name,
        uint price,
        address owner,
        bool purchased
    );

    struct Product{
        uint id;
        string name;
        uint price;
        address owner;
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



}