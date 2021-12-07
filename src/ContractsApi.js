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
    console.log(pollName, description, option1, option2)
    return this.votingContract.methods
    .createPoll(pollName, description, option1, option2)
    .send({ from: this.selectedAddress });
  }

  async getPolls(){
    return this.votingContract.methods.pollID().call();
  }

  async getPollInformation(pollID){
    return this.votingContract.methods.polls(pollID).call();
  }

  async getPollCandidates(pollID){
    return this.votingContract.methods.getCandidates(pollID).call();
  } 


  //TODO (optional i guess): now to seperate transactions that both need the confirmation --> if one fails you might not be able to vote but can't join either
  //idea: "link" them so they're both only executed if both are valid
  async joinPoll(pollID){
    this.votingContract.methods.joinPoll(pollID).send({ from: this.selectedAddress });
    this.erc20contract.methods.approve(this.votingContractAddress, 1).send({ from: this.selectedAddress });
  }

  vote(pollID, voteIndex){
    const promiEvent = this.votingContract.methods.vote(pollID, voteIndex).send({ from: this.selectedAddress });
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
