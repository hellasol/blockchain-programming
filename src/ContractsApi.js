import Web3 from "web3";
import { abi as erc20Abi } from "./build/contracts/VoteToken.json"; 
import { abi as faucetAbi } from "./build/contracts/VoteTokenFaucet.json"; 

//TODO votingLogicAbi
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

    this.erc20contract = new this.web3.eth.Contract(erc20Abi, this.erc20ContractAddress);
    this.faucetContract = new this.web3.eth.Contract(faucetAbi, this.faucetContractAddress);

    console.log(this.erc20contract);
    console.log(this.faucetContract);
  }

  get selectedAddress() {
    return window.ethereum.selectedAddress;
  }

  // approve() {
  //   const promiEvent = this.erc20contract.methods
  //     .approve(this.decentralightContractAddress, 1)
  //     .send({ from: this.selectedAddress });
  //   return new TransactionWatcher(promiEvent);
  // }
  // async getState() {
  //   return await this.decentralightContract.methods.getState().call();
  // }
  // async getAllowance() {
  //   return await this.erc20contract.methods.allowance(
  //     this.selectedAddress,
  //     this.decentralightContractAddress
  //   );
  // }
  // toggle() {
  //   const promiEvent = this.decentralightContract.methods
  //     .toggle()
  //     .send({ from: this.selectedAddress });
  //   return new TransactionWatcher(promiEvent);
  // }
  async getCurrentBlance() {
    const balance = await this.erc20contract.methods
      .balanceOf(this.selectedAddress)
      .call();
    return balance;
  }
  // async transferFrom() {
  //   await this.erc20contract.methods
  //     .transferFrom(this.selectedAddress, this.decentralightContractAddress)
  //     .send({ from: this.selectedAddress });
  // }
  mint() {
    const promiEvent = this.faucetContract.methods.mint()
    return new TransactionWatcher(promiEvent);
  }
}
class TransactionWatcher {
  constructor(promiEvent) {
    this.promiEvent = promiEvent;
  }
  onTxHash(callback) {
    this.promiEvent.once("transactionHash", () => {
      callback();
    });
    return this;
  }
  onConfirmation(callback) {
    this.promiEvent.once("confirmation", () => {
      callback();
    });
    return this;
  }

  then(callback) {
    return this.promiEvent.then(callback);
  }
}
