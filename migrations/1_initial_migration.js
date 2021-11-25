const Migrations = artifacts.require("Migrations");
const VoteToken = artifacts.require("VoteToken");
const VoteTokenFaucet = artifacts.require("VoteTokenFaucet");

//grant minterrole and mint tokens 
module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Migrations);

  const voteToken = await deployer.deploy(VoteToken);

  const voteTokenFaucet = await deployer.deploy(VoteTokenFaucet, voteToken.address);
  await voteToken.grantRole(await voteToken.MINTER_ROLE(), voteTokenFaucet.address);
};


