const Migrations = artifacts.require("Migrations");
const VoteToken = artifacts.require("VoteToken");
const VoteTokenFaucet = artifacts.require("VoteTokenFaucet");
const Poll = artifacts.require("Poll")

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Migrations);
  //deposit the vote token
  const voteToken = await deployer.deploy(VoteToken);

  //deploy the faucet
  const voteTokenFaucet = await deployer.deploy(VoteTokenFaucet, voteToken.address);

  //grant minterrole to faucet
  await voteToken.grantRole(await voteToken.MINTER_ROLE(), voteTokenFaucet.address);

  const poll = await deployer.deploy(Poll, 'Who will win?', 'Who will win the election?', 'Trump', 'Biden', voteToken.address);
};


