# VOTE Token (Blockchain Programming Lab Group 9)

## Project Description
In this project, a token-based voting system was developed and deployed on the UZHETH network. The focus was on developing smart contracts for the ERC-20 token, ERC-20 Faucet, and Poll. We also developed a simple frontend in order to demonstrate the functioning of the smart contracts. 

## Running the project locally
Clone and open the project 
```
git clone https://github.com/hellasol/blockchain-programming.git
```

```
cd blockchain-programming
```
```
code .
```

Install dependencies
```
npm install
```
Run the start script and the web app will be available on http://localhost:3000/
```
npm start
```
You need to use a Chrome browser and have MetaMask installed for it to work properly. 

Once you have logged into your MetaMask account you will be able to mint your first **VOTE** token by using the faucet. 

You can then use the **VOTE** token to cast a vote in the poll. 


## Deploying your own contract 

Add the new contract in the **contracts** folder. 

Add a new migration file in the **migrations** folder. Example of migration file:
```ts
const  VoteToken = artifacts.require("VoteToken");
const  Poll = artifacts.require("Poll")

module.exports = async  function (deployer, network, accounts) {
	const  voteToken = await  VoteToken.deployed();
	const  poll = await  deployer.deploy(Poll, 'Who will win?', 'Who will win the election?', 'Trump', 'Biden', voteToken.address);
};
```

Compile and deploy the new contract on the **Kovan** test network:

You will need to add a **mnemonic** and a **projectId** to your secrets.json file. 
You can create a **mnemonic** by running the following command:
```
npx mnemonics
```
We recomend you use **infura.io** to create a project and add the resulting **projectId** to the secrets.json. 

```ts
{
    "mnemonic": "******* ******* ******* ******* ******* ******* ******* ******* ******* ******* ******* *******",
    "projectId": "***********************************"
}
```

The **mnemonic** and **projectId** are used in the truffel-config.js file: 

```ts
{
    kovan: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://kovan.infura.io/v3/${projectId}`
        ),
      network_id: "42",
    },
}
```
Add a new migration file in the migrations folder, like below: 

```ts
const VoteToken = artifacts.require("VoteToken");
const Poll = artifacts.require("Poll")

module.exports = async function (deployer, network, accounts) {
  const voteToken = await VoteToken.deployed();

  const poll = await deployer.deploy(Poll, 'Who will win?', 'Who will win the Champions League?', 'Ajax', 'PSG', voteToken.address);
};
```

You can now migrate your contract by executing the following commands in the console: 

```
truffle console --network kovan
```
```
migrate
```

Compile and deploy the new contract on the **UZHETH** network:

You will need create a **mnemonic** and add it to your secrets.json file.
You can create a **mnemonic** by running the following command:

```
npx mnemonics
```

The **mnemonic** is used in the truffel-config.js file: 

```ts
{
    uzheth: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          'http://130.60.244.246:8545'
        ),
      network_id: "702",
    },
```

Add a new migration file in the migrations folder, like below: 

```ts
const VoteToken = artifacts.require("VoteToken");
const Poll = artifacts.require("Poll")

module.exports = async function (deployer, network, accounts) {
  const voteToken = await VoteToken.deployed();

  const poll = await deployer.deploy(Poll, 'Who will win?', 'Who will win the Champions League?', 'Ajax', 'PSG', voteToken.address);
};

```
You can now migrate your contract by executing the following commands in the console: 

```
truffle console --network uzheth
```
```
migrate
```
Use the resulting **contract address** to interact with your contract. 

You can add any other networks in the truffle-config.js file. 