const VoteToken = artifacts.require("VoteToken");
const Poll = artifacts.require("Poll")

module.exports = async function (deployer, network, accounts) {
  const voteToken = await VoteToken.deployed();

  const poll = await deployer.deploy(Poll, 'Who will win?', 'Who will win the Champions League?', 'Ajax', 'PSG', voteToken.address);
};