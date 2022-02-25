import React, { Component } from 'react';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Web3 from 'web3';

import Identicon from 'identicon.js';
import Navbar from './Navbar';
import Main from './Main';

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
      // Load Posts
      for(var i =1; i <= postCount; i++){
        //fetch the post from the blockchain
        const post = await socialNetwork.methods.posts(i).call()
        //Store it into a state
        this.setState({
          posts: [...this.state.posts, post]
        })
        console.log({ posts: this.state.posts })
      }
      this.setState({loading: false })
    } else {
      window.alert('SocialNetwork contract not deployed to the detected network')
    }
    // Address 
    // ABI
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  };

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0, 
      posts: [],
      loading: true
      
    }

    this.createPost  = this.createPost.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        {this.state.loading 
          ? <div id="loader" className="text-center mt-5"><p>loading....</p></div>
          : <Main 
              posts ={this.state.posts}
              createPost = { this.createPost }
            />
        }


      </div>
    );
  }
}

export default App;
