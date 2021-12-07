// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./VoteToken.sol";

contract Voting {

    event _PollCreated(string pollName, string description, uint256 indexed pollID, address indexed creator);

    struct Poll {
        string pollName;
        string description;
        uint256 totalVotes;
        mapping(address => Voter) voters;
        Candidate [] candidates;
    }
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    struct Voter {
        bool joined;
        bool voted;
        uint256 vote;
    }
    
    mapping(uint => Poll) public polls;
    uint public pollID;

    VoteToken public token;

    constructor(address _token) {
        require(_token != address(0) && address(token) == address(0));
        token = VoteToken(_token);
    }  

    function createPoll(string memory _pollName, string memory _description, string memory _candidate1, string memory _candidate2) public returns (uint256){
        pollID = pollID + 1;

        Poll storage newPoll = polls[pollID];
        newPoll.pollName = _pollName;
        newPoll.description = _description;
        newPoll.totalVotes = 0;

        polls[pollID].candidates.push(Candidate(_candidate1,0));
        polls[pollID].candidates.push(Candidate(_candidate2,0));

        emit _PollCreated(_pollName, _description, pollID, msg.sender);
        return pollID;
    }
    
    function getNumCandidate(uint256 _pollID) public view returns(uint256) {
        return polls[_pollID].candidates.length;
    }
    
    function getCandidates(uint256 _pollID) public view returns(Candidate [] memory){
        return polls[_pollID].candidates;
    }
    
    function joinPoll(uint256 _pollID) public{
        require(
            !polls[_pollID].voters[msg.sender].joined,
            "Joined already!"
            );
            
        polls[_pollID].voters[msg.sender].joined=true;
    }
    
    function vote(uint256 _pollID, uint256 _voteIndex) public{
        require(
            !polls[_pollID].voters[msg.sender].voted,
            "Voted already!"
            );
        
        require(token.balanceOf(msg.sender) >= 1, "Not enough balance");
        require(token.transferFrom(msg.sender, address(this), 1));
       
        polls[_pollID].voters[msg.sender].vote=_voteIndex;
        polls[_pollID].voters[msg.sender].voted=true;
        
        polls[_pollID].candidates[_voteIndex].voteCount+=1;
        polls[_pollID].totalVotes+=1;
    }    
    
    /*
    function end() public {
        selfdestruct(payable(owner));
    }
    */
}
