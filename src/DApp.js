import React, { useState, useEffect } from "react";
import { Col } from "reactstrap";
import { ContractsApi } from "./ContractsApi";
import "./css/style.css"
import faucet from "./img/faucet.png"
import { SpinnerAnimation } from "./components/spinner";
import { SimpleSlider } from "./components/slider";

export function DApp() {
  const [balance, setBalance] = useState(0);
  const [etherBalance, setCurrentEtherBalance] = useState(0);
  const [pending, setPending] = useState(false);
  const [hasEthereum, setHasEthereum] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(0);

  const [pollName, setPollName] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');

  const contractsApi = new ContractsApi();
  async function syncData() {
    const currentBalance = await contractsApi.getCurrentVoteTokenBalance();
    setBalance(currentBalance);

    const currentSelectedAddress = contractsApi.selectedAddress;
    setSelectedAddress(currentSelectedAddress);

    const currentEtherBalance = await contractsApi.getCurrentEtherBalance(currentSelectedAddress);
    setCurrentEtherBalance(currentEtherBalance);
  }

  useEffect(() => {
    async function onMount() {
      const hasEthereum = await contractsApi.init();
      setHasEthereum(hasEthereum);
      if (hasEthereum) {
        await syncData();
        setInterval(syncData, 5000);
      }
    }
    onMount();
  }, []);

  if (pending) {
    return (
      <div className="spinner">
        <SpinnerAnimation />
      </div>
    );
  }
  if (!hasEthereum) {
    return (
      <h1>
        Non-Ethereum browser detected. You should consider trying MetaMask!
      </h1>
    );
  }

  function handleMint() {
    contractsApi
      .mint()
      .onTxHash(() => setPending(true))
      .onConfirmation(() => setPending(false));
  }

  function handleCreatePoll() {
    contractsApi.createPoll({pollName}, {pollDescription}, {option1}, {option2});
  }

  async function logPolls() {
    const numberOfPolls = await contractsApi.getPolls();
    console.log(numberOfPolls);
  }

  return (
    <div className="App">
      {/* HEADER */}
      <nav className="navbar">
        <div className="container">
          <a className="logo">
            VOTE
          </a>
          <div className="wallet-info">Your account: {selectedAddress}</div>
          <div className="wallet-info">Your ETH balance: {etherBalance}</div>
          <div className="wallet-info">Your VOTE balance: {balance}</div>
        </div>
      </nav>
      <section className="pt-150 pb-150">
        <div className="container">
          <div class="row">
            {/* CREATE POLL */}
            <div class="col-lg-5 col-md-6">
              <h2>CREATE POLL </h2>
              <form>
                <label className="formLabel" for="pollName">Poll Name:</label><br />
                <input className="formInput" type="text" id="pollName" value={pollName} onChange={e => setPollName(e.target.value)}></input><br />

                <label className="formLabel" for="pollDescription">Poll Description:</label><br />
                <textarea className="formInput" type="text" id="pollDescription" value={pollDescription} onChange={e => setPollDescription(e.target.value)}></textarea><br />

                <label className="formLabel" for="pollOption1">Poll Option 1:</label><br />
                <input className="formInput" type="text" id="pollOption1" value={option1} onChange={e => setOption1(e.target.value)}></input><br />

                <label className="formLabel" for="pollOption2">Poll Option 2:</label><br />
                <input className="formInput" type="text" id="pollOption2" value={option2} onChange={e => setOption2(e.target.value)}></input><br />
              </form>
              <span className="about-button">
                <a className="main-btn" onClick={handleCreatePoll}>CREATE POLL</a>
              </span>
              <span className="about-button">
                <a className="main-btn" onClick={logPolls}>Nr of Polls</a>
              </span>
            
            </div>
            {/* FAUCET */}
            <div class="col-lg-7 col-md-6">
              <div className="container">
                <h2>FAUCET</h2>
                <div className="faucet-img">
                  <img src={faucet}></img>
                </div>
                <span className="about-button">
                  <a className="main-btn" onClick={handleMint}>Get 1 VOTE Token!</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ALL POLLS */}
      <section className="services pt-100 pb-150">
        <div className="container">
          <h2>ALL POLLS</h2>
          {/* <SimpleSlider/> */}
        </div>
      </section>
      {/* FOOTER */}
      <section>
        <footer className="pt-100">
          <div className="row text-center">
            <div className="col-md-12">
              <p className="copy pt-100">
                Group ? &copy; 2021 All Right Reserved
              </p>
            </div>
          </div>
        </footer>
      </section>
    </div >
  );
}
