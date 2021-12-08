import Web3 from "web3";
import { abi as erc20Abi } from "./build/contracts/VoteToken.json";
import { abi as faucetAbi } from "./build/contracts/VoteTokenFaucet.json";
import { abi as pollAbi } from "./build/contracts/Poll.json";

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

    this.erc20ContractAddress = process.env.REACT_APP_ERC20CONTRACT_ADDRESS;
    this.faucetContractAddress = process.env.REACT_APP_FAUCET_CONTRACT_ADDRESS;
    this.pollContractAddress = process.env.REACT_APP_POLL_CONTRACT_ADDRESS;

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

  async fetchName(){
    return this.pollContract.methods.electionName().call();
  }

  async fetchDescription(){
    return this.pollContract.methods.description().call();
  }

  async fetchCandidates(){
    return this.pollContract.methods.getCandidates().call();
  }

  async join(){
    this.pollContract.methods.join().send({ from: this.selectedAddress });
    this.erc20contract.methods.approve(this.pollContractAddress, 1).send({ from: this.selectedAddress });
  }

  vote(voteIndex){
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
