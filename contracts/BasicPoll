// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract BasicPoll {
    
    //own datas type for the definition of a candidate
    struct Candidate {
        string Name;
        uint256 VoteCount;
    }
    //own datas type for a voter
    struct Voter {
        bool authorized;
        bool voted;
        uint256 vote;
    }
    
    //poll owner
    address public owner;
    //name of the election
    string public electionName;
    //define key-value voters map, i.e. each voter has an address
    mapping(address => Voter) public voters;
     //array of candidate types
    Candidate [] public candidates;
    //count of all votes for the current poll
    uint256 public totalVotes;
    //when invoked, restrict function usage only to contract owner
    modifier ownerOnly () {
        require(msg.sender==owner);
        _;
    }
    
    //by default have a poll/election owner and a poll name defined
    constructor(string memory _name)  {  
        owner = msg.sender;
        electionName = _name;
    }  
    
    //add a candidate for the poll
    function addCandidate(string memory _name) ownerOnly public {
        candidates.push(Candidate(_name,0));
    }
    
     //get the number of candidates
    function getNumCandidate() public view returns(uint256) {
        return candidates.length;
    }
    
    /* Can return the entire array of Candidates, but according to Solidity this should be 
    avoided for arrays that can grow indefinitely in length. */
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
   
    //only authorized voters can vote. only poll owner can authorize them
    function authorize(address _person) ownerOnly public {
        voters[_person].authorized = true;
    }
    
    //voting, if not voted already and if authorized
    function vote(uint256 _voteIndex) public{
        require(
            !voters[msg.sender].voted,
            "Voted already!"
            );
        require(
            voters[msg.sender].authorized,
            "Not authorized to vote!"
            );
        
        //when invoked, restrict function usage only to contract owner
        voters[msg.sender].vote=_voteIndex;
        //now voted
        voters[msg.sender].voted=true;
        //candidate at _voteIndex got one vote
        candidates[_voteIndex].VoteCount+=1;
         //total votes for this poll
        totalVotes+=1;
    }    
    
    //end the poll, possible only if done by poll owner
    function end() ownerOnly public {
        //destroys this contract
        selfdestruct(payable(owner));
        //if the contract had any ether currently, any remaining ethers
        //would be transferred to the owner address
    }
}
