const { default: expectationResultFactory } = require("jest-jasmine2/build/expectationResultFactory");

const VoteToken = artifacts.require("VoteToken");
const VoteTokenFaucet = artifacts.require("VoteTokenFaucet");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

//Tests if the voteTokenFaucet works as expected
contract("VoteTokenFaucet", function ([account]) {

  let voteToken;
  let voteTokenFaucet;

  beforeEach(async function () {
    voteToken = await VoteToken.deployed();
    voteTokenFaucet = await VoteTokenFaucet.deployed();
  });

  it("should be non-null", async function () {
    assert.isNotNull(voteTokenFaucet);
  });

  it("should mint tokens", async function () {
    assert.equal(await voteToken.balanceOf(account), 0);
    
    await voteTokenFaucet.mint();

    assert.equal(await voteToken.balanceOf(account), 1);

  });
});
