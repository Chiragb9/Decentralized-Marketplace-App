import React, { Component } from 'react';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state={
      account: "",
      productCount: 0,
      products: [],
      loading: true 
     }
  }

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert("Your broSwser doen't support Ethereum. Try using Metamak!")
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account:accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = await Marketplace.networks[networkId]
    if(networkData){
      const marketplace = web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address)
      this.setState({ marketplace });
      const productCount = await marketplace.methods.productCount().call()
      console.log(productCount.toString())
      this.setState({ productCount })
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({loading: false});
      }else{
      window.alert("Marketplace not detected on the network");
      }
    }
    
    createProduct=(name, price)=>{
      this.setState({ loading: true })
      this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        window.location.reload(true)
      })
    }

    purchaseProduct=(id, price)=>{
      this.setState({loading: true});
      this.state.marketplace.methods.purchaseProduct(id).send({from: this.state.account, value: price})
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
    }

  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
        <Navbar account={this.state.account}/>
        </div>
        <main role="main" className="col-lg-12 d-flex">
          { this.state.loading
            ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
            : <Main 
            products={this.state.products}
            createProduct={this.createProduct} 
            purchaseProduct={this.purchaseProduct}
            />
          }
        </main>
      </div>
    );
  }
}

export default App;
