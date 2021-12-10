import Web3 from "web3";
import { abi as erc20Abi } from "./build/contracts/VoteToken.json";
import { abi as faucetAbi } from "./build/contracts/VoteTokenFaucet.json";
import { abi as pollAbi } from "./build/contracts/Poll.json";

//ContractsApi is a wrapper for web3.js. It provides a convenient way to interact with the contracts.
export class ContractsApi {

  async init() {
    if (!window.ethereum) {
      return false;
    }
    try {
      await window.ethereum.enable();
    } catch (error) {
      return false;
    }
    return true;
  }

  constructor() {
    this.web3 = new Web3(Web3.givenProvider);
    //FOR KOVAN
    // REACT_APP_ERC20CONTRACT_ADDRESS = 0xBBf6a32515F96954bd51739AE67B87c5037EA3a4
    // REACT_APP_FAUCET_CONTRACT_ADDRESS = 0xA09646632DA392Fe6256D70e537dF7a2Ca09bAB1
    // REACT_APP_POLL_CONTRACT_ADDRESS = 0xDDB132FBC4b3288d500b97d8B3bbCf174E0A07E5

    //FOR Local development
    //this.erc20ContractAddress = '0xF6Cfb6eA7E844Cd6cb8112F1095ff63585502536';
    //this.faucetContractAddress = '0xbF347e7D5a264101B717229C020B84d65e46aAC2';
    //this.pollContractAddress = '0x9736bA8ad7832b1B13b92FB2e76197944F63c589';

    
    this.erc20ContractAddress = '0xB163626D6785a8e136C43fe78c6570D7d6b31c2A';
    this.faucetContractAddress = '0x43f420AE27E4dfDbb4D097DD355BD8b0098bA744';
    this.pollContractAddress = '0xA09646632DA392Fe6256D70e537dF7a2Ca09bAB1';

    this.erc20contract = new this.web3.eth.Contract(erc20Abi, this.erc20ContractAddress);
    this.faucetContract = new this.web3.eth.Contract(faucetAbi, this.faucetContractAddress);
    this.pollContract = new this.web3.eth.Contract(pollAbi, this.pollContractAddress);
  }

  get selectedAddress() {
    return window.ethereum.selectedAddress;
  }

  async getCurrentVoteTokenBalance() {
    return this.erc20contract.methods
      .balanceOf(this.selectedAddress)
      .call();
  }

  async getCurrentEtherBalance(address) {
    return this.web3.eth.getBalance(address);
  }

  mint() {
    const promiEvent = this.faucetContract.methods
      .mint()
      .send({ from: this.selectedAddress });
    console.log(promiEvent);
    return new TransactionWatcher(promiEvent);
  }

  async fetchName() {
    return this.pollContract.methods.electionName().call();
  }

  async fetchDescription() {
    return this.pollContract.methods.description().call();
  }

  async fetchCandidates() {
    return this.pollContract.methods.getCandidates().call();
  }

  async join() {
    this.pollContract.methods.join().send({ from: this.selectedAddress });
    this.erc20contract.methods.approve(this.pollContractAddress, 1).send({ from: this.selectedAddress });
  }

  vote(voteIndex) {
    const promiEvent = this.pollContract.methods.vote(voteIndex).send({ from: this.selectedAddress });
    console.log(promiEvent);
    return new TransactionWatcher(promiEvent);
  }
}

class TransactionWatcher {
  constructor(promiEvent) {
    this.promiEvent = promiEvent;
  }
  onTxHash(callback) {
    this.promiEvent.on("transactionHash", () => {
      callback();
    });
    return this;
  }
  onConfirmation(callback) {
    this.promiEvent.on("confirmation", () => {
      callback();
    });
    return this;
  }

  then(callback) {
    return this.promiEvent.then(callback);
  }
}
