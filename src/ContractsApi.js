import Web3 from "web3";
import { abi as erc20Abi } from "./build/contracts/VoteToken.json";
import { abi as faucetAbi } from "./build/contracts/VoteTokenFaucet.json";
import { abi as votingAbi } from "./build/contracts/Voting.json";

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
    this.votingContractAddress = process.env.REACT_APP_VOTING_CONTRACT_ADDRESS;

    this.erc20contract = new this.web3.eth.Contract(erc20Abi, this.erc20ContractAddress);
    this.faucetContract = new this.web3.eth.Contract(faucetAbi, this.faucetContractAddress);
    this.votingContract = new this.web3.eth.Contract(votingAbi, this.votingContractAddress);
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

  async createPoll(pollName, description, option1, option2){
    this.votingContract.methods.createPoll(pollName, description, option1, option2);
  }

  async getPolls(){
    return this.votingContract.methods.pollID().call();
  }

  async getPollInformation(pollID){
    return this.votingContract.methods.polls(pollID).call();
  }

  async getPollCandidates(pollID){
    return this.votingContract.methods.getPollCandidates(pollID).call();
  }

  joinPoll(pollID){
    console.log(pollID)
    this.votingContract.methods.joinPoll(pollID).call();
    this.erc20contract.methods.approve(this.votingContractAddress, 1).call();
  }

  vote(pollID, voteIndex){
    this.votingContract.methods.vote(pollID, voteIndex).call();
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
