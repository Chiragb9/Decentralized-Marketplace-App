import React, { Component } from 'react';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
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
      console.log(marketplace);
    }else{
      window.alert("Marketplace not detected on the network");
    }
    }

  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
        <Navbar account={this.state.account}/>
          <div className="row">
          </div>
        </div>
      </div>
    );
  }
}

export default App;
