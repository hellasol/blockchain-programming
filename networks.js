// const { projectId, mnemonic } = require("./secrets.json");
// const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      protocol: "http",
      host: "localhost",
      port: 9545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: "*",
    },
    // kovan: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       mnemonic,
    //       `https://kovan.infura.io/v3/${projectId}`
    //     ),
    //   networkId: "42",
    // },
    // mainnet: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       mnemonic,
    //       `https://mainnet.infura.io/v3/${projectId}`
    //     ),
    //   networkId: "1",
    // },
  },
};
