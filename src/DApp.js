import React, { useState, useEffect } from "react";
import { Col } from "reactstrap";
import { ContractsApi } from "./ContractsApi";
import "./css/style.css"
import faucet from "./img/faucet.png"
import { SpinnerAnimation } from "./components/spinner";
import { SimpleSlider } from "./components/slider";

export function DApp() {
  const [balance, setBalance] = useState(0);
  const [currentEtherBalance, setCurrentEtherBalance] = useState(0);
  const [pending, setPending] = useState(false);
  const [hasEthereum, setHasEthereum] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(0);

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
      <Col sm={{ size: 4, offset: 6 }}>
        <SpinnerAnimation />
      </Col>
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

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <a className="navbar-brand logo" href="">
            VOTE
          </a>
          <div className="wallet-info" data-scroll-nav="2">Your account: {selectedAddress}</div>
          <div className="wallet-info" data-scroll-nav="2">Your ETH balance: {currentEtherBalance}</div>
          <div className="wallet-info" data-scroll-nav="2">Your VOTE balance: {balance}</div>
          
        </div>
      </nav>

      {/* CREATE POLL */}
      <section className="about pt-300 pb-150" data-scroll-index="1">
        <div className="container">
          <div class="row">

            <div class="col-lg-5 col-md-6">
              <h2>CREATE POLL </h2>
              <form>
                <label className="formLabel" for="pollName">Poll Name:</label><br />
                <input className="formInput" type="text" id="pollName"></input><br />

                <label className="formLabel" for="pollDescription">Poll Description:</label><br />
                <textarea className="formInput" type="text" id="pollDescription"></textarea><br />

                <label className="formLabel" for="pollOption1">Poll Option 1:</label><br />
                <input className="formInput" type="text" id="pollOption1"></input><br />

                <label className="formLabel" for="pollOption2">Poll Option 2:</label><br />
                <input className="formInput" type="text" id="pollOption2"></input><br />

                <label className="formLabel" for="pollOption3">Poll Option 3:</label><br />
                <input className="formInput" type="text" id="pollOption3"></input><br />

                <label className="formLabel" for="deadline">Expiration Date:</label><br />
                <input className="formInput" type="text" id="deadline"></input><br />
              </form>
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
      <section className="services pt-100 pb-150" data-scroll-index="3">
        <div className="container">
          <h2>ALL POLLS</h2>
          <SimpleSlider />
        </div>
      </section>
      {/* FOOTER */}
      <section>
        <footer className="pt-100">
          <div className="row text-center">
            <div className="col-md-12">
              <p className="copy pt-10">
                Group ? &copy; 2021 All Right Reserved
              </p>
            </div>
          </div>
        </footer>
      </section>
    </div >
  );
}
