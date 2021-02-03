import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import Web3 from 'web3';
import lendingPoolAddressesProviderABI from './LendingPoolAddressProviderABI';

class App extends Component {
  constructor(){
    super();
    this.state = {
      web3: {},
      web3Socket: {},
      instance: {},
      socketInstance: {},
      liquidations: {}
    }
  }
  
  componentDidMount () {
    if (window.ethereum != null) {
      const web3 = new Web3(window.ethereum);
      if(web3){
        this.setState({
          web3: web3
        });
      }
    }
  }

  getAccounts = async () => {
    const accounts = await this.state.web3.eth.getAccounts();
    console.log(accounts);
  }

  getWeb3Socket = async () => {
    console.log('Inhere')
    try{
      let web3Socket = this.state.web3;
      const networkName = await this.state.web3.eth.net.getNetworkType();
      if(networkName === "kovan"){
        web3Socket = new Web3(new Web3.providers.WebsocketProvider("wss://kovan.infura.io/ws/v3/fc9da9a67ca34268aaaf83eec25c91db"));
        console.log(web3Socket)
        this.setState({
          web3Socket: web3Socket
        })
      }
      console.log(this.state);
    }
    catch(err){
      console.log(err);
    }
  };

  loadAdressesProviderContract = async (address) => {
    const instance = await new this.state.web3.eth.Contract(lendingPoolAddressesProviderABI, address);
    const socketInstance = await new this.state.web3Socket.eth.Contract(lendingPoolAddressesProviderABI, address);
    this.setState({
      instance,
      socketInstance
    });

    console.log(this.state);
  }

  // TODO: Complete Function for Subscribing to events using socket

  getTopLiquidations = async () => {
    try{
      const response = await fetch('https://protocol-api.aave.com/liquidations?get=proto');
      const liquidations = await response.json();
      console.log('Data from Liquidations API:',liquidations);
      this.setState({
        liquidations: liquidations.data.slice(0,10)
      });

      console.log(this.state);
    }
    catch(err){
      console.log(err);
    }
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button
            className="App-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.getWeb3Socket()}
          >
            Fire Web3Socket
          </button>
          <button
            className="App-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.loadAdressesProviderContract('0x88757f2f99175387aB4C6a4b3067c77A695b0349')}
          >
            Instantiate contracts
          </button>
          <button
            className="App-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.getTopLiquidations()}
          >
            Fetch Liquidations
          </button>
        </header>
      </div>
    );
  }

};

export default App;
