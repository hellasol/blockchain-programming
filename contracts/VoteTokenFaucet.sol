pragma solidity >=0.4.22 <0.9.0;

import "./VoteToken.sol";

contract VoteTokenFaucet {
    VoteToken _token;

    constructor(VoteToken token) {
        _token = token;
    }

    //calls the mint function in the VoteToken contract
    function mint() public {
        _token.mint(msg.sender, 1);
    }
}
