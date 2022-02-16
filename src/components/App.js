import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Web3 from 'web3';

import Navbar from './Navbar';

class App extends Component {
  // Now we call the function above wheneever the react component is loaded
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //This function connects our app to the blockchain . This code detects the presence  of an Ethereum provider in the web browser,
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  
  // Now lets import our account from Ganache into Metamask.
  async loadBlockchainData() {
    const web3 = window.web3
    // Load the account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({ account: accounts[0] })
    //Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    //console.log(networkId)
    if(networkData) {
      //This is all we need to be able to call all the methods we created on our solidity network
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      console.log(postCount)
      //console.log(networkId)
      //console.log(socialNetwork)
    } else {
      window.alert('SocialNetwork contract not deployed to the detected network')
    }
    // Address 
    // ABI
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0 
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
