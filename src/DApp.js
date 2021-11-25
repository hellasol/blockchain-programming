import React, { useState, useEffect } from "react";
import { Card, Button, CardText, Row, Col } from "reactstrap";
import { ContractsApi } from "./ContractsApi";
import "./App.css";
import lightbulbON from "./images/lightbulbON.png";
import lightbulbOFF from "./images/lightbulbOFF.png";
import { SpinnerAnimation } from "./components/spinner";

export function DApp() {
  const [balance, setBalance] = useState(0);
  const [lightStatus, setLightStatus] = useState(false);
  const [pending, setPending] = useState(false);
  const [canApprove, setCanApprove] = useState(true);
  const [canToggle, setCanToggle] = useState(false);
  const [hasEthereum, setHasEthereum] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(0);

  const contractsApi = new ContractsApi();
  async function syncData() {
    const currentBalance = await contractsApi.getCurrentBlance();
    const currentLightStatus = await contractsApi.getState();
    const currentSelectedAddress = contractsApi.selectedAddress;
    setBalance(currentBalance);
    setLightStatus(currentLightStatus);
    setSelectedAddress(currentSelectedAddress);
  }
  useEffect(() => {
    async function onMount() {
      const hasEthereum = await contractsApi.init();
      setHasEthereum(hasEthereum);
      console.log("1" + hasEthereum);

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
    console.log("2" + hasEthereum);
    return (
      <h1>
        Non-Ethereum browser detected. You should consider trying MetaMask!
      </h1>
    );
  }

  function handleToggle() {
    contractsApi
      .toggle()
      .onTxHash(() => setPending(true))
      .onConfirmation(() => {
        setPending(false);
        setCanToggle(false);
        setCanApprove(true);
      });
  }
  function handleWithdraw() {
    contractsApi
      .withdraw()
      .onTxHash(() => setPending(true))
      .onConfirmation(() => setPending(false));
  }

  function handleApprove() {
    contractsApi
      .approve()
      .onTxHash(() => setPending(true))
      .onConfirmation(() => {
        setPending(false);
        setCanApprove(false);
        setCanToggle(true);
      });
  }

  return (
    <div className="App">
      <div className="App-header">
        <p>Your account: {selectedAddress}</p>
        <p>Your DEC balance: {balance}</p>
        <h1>Decentralight</h1>
      </div>
      <br />
      <br />
      <Row>
        <Col sm={{ size: 4, offset: 1 }}>
          <Card
            body
            inverse
            style={{
              backgroundColor: "#282c34",
              borderColor: "#282c34",
              position: "",
            }}
            className="text-center"
          >
            <br />
            <h1>Faucet</h1>
            <br />
            <br />
            <CardText>
              <Button onClick={handleWithdraw}>
                Get 1 decentralight coin!
              </Button>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </CardText>
          </Card>
        </Col>
        <Col sm={{ size: 3, offset: 0 }}>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          {canApprove && (
            <Button onClick={handleApprove}>Approve transaction</Button>
          )}
          {canToggle && (
            <Button onClick={handleToggle}>Control the light</Button>
          )}
        </Col>

        <Col sm={{ size: 2, offset: 0 }}>
          <br />
          <br />
          {lightStatus ? (
            <img src={lightbulbON} alt="ON" width="200" />
          ) : (
            <img src={lightbulbOFF} alt="OFF" width="200" />
          )}
        </Col>
      </Row>
    </div>
  );
}
