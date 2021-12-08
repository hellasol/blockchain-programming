// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./VoteToken.sol";

contract Poll {
    
    struct Candidate {
        string Name;
        uint256 VoteCount;
    }
    
    struct Voter {
        bool joined;
        bool voted;
        uint256 vote;
    }
    
    address public owner;
    string public electionName;
    string public description;
    VoteToken public token;
    
    mapping(address => Voter) public voters;
    Candidate [] public candidates;
    uint256 public totalVotes;
    
    modifier ownerOnly () {
        require(msg.sender==owner);
        _;
    }

    constructor(string memory _name, string memory _description, string memory _candidate1, string memory _candidate2, address _token) {  
        owner = msg.sender;
        electionName = _name;
        description = _description;

        candidates.push(Candidate(_candidate1,0));
        candidates.push(Candidate(_candidate2,0));
        
        require(_token != address(0) && address(token) == address(0));
        token = VoteToken(_token);
    }  
    
    function addCandidate(string memory _name) ownerOnly public {
        candidates.push(Candidate(_name,0));
    }
    
    function getNumCandidate() public view returns(uint256) {
        return candidates.length;
    }

    function getCandidates() public view returns(Candidate [] memory){
        return candidates;
    }
    
    function join() public{
        require(
            !voters[msg.sender].joined,
            "Joined already!"
            );
            
        voters[msg.sender].joined=true;    
    }
    
    function vote(uint256 _voteIndex) public{
        require(
            !voters[msg.sender].voted,
            "Voted already!"
            );
        require(
            voters[msg.sender].joined,
            "Join it first!"
            );
        
       
        voters[msg.sender].vote=_voteIndex;
        voters[msg.sender].voted=true;
        
        candidates[_voteIndex].VoteCount+=1;
        totalVotes+=1;
    }    
    
    function end() ownerOnly public {
        selfdestruct(payable(owner));
    }
}
