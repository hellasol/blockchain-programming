// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./VoteToken.sol";

contract Poll {
    
    //create own data type for a poll candidate
    struct Candidate {
        string Name;
        uint256 VoteCount;
    }
    
    //create own data type for a voter
    struct Voter {
        bool joined;
        bool voted;
        uint256 vote;
    }
    
    //the contract owner will be the deployer of the contract
    address public owner;
    //name of the poll
    string public electionName;
    //poll description
    string public description;
    //the ERC20 tokens used for voting
    VoteToken public token;
    //define key-value voters map, i.e. each voter has an address
    mapping(address => Voter) public voters;
    //array of candidate types
    Candidate [] public candidates;
    //count of all votes for the current poll
    uint256 public totalVotes;
    
    
    //when invoked, restrict function usage only to contract owner
    modifier ownerOnly () {
        require(msg.sender==owner);
        //execute function if owner condition was met
        _;
    }

    //the constructor of the poll with a name, description, 2 candidates and the corresponding token address
    constructor(string memory _name, string memory _description, string memory _candidate1, string memory _candidate2, address _token) {  
        owner = msg.sender;
        electionName = _name;
        description = _description;

        //by default 2 candidates
        candidates.push(Candidate(_candidate1,0));
        candidates.push(Candidate(_candidate2,0));
        
        //make sure no zero address is used to create the vote token
        require(_token != address(0) && address(token) == address(0));
        
        //vote tokens will be ERC20 tokens; "connecting it"
        token = VoteToken(_token);
    }  
    
    // add any other candidate than the default 2 
    function addCandidate(string memory _name) ownerOnly public {
        candidates.push(Candidate(_name,0));
    }
    
    //get the number of candidates
    function getNumCandidate() public view returns(uint256) {
        return candidates.length;
    }

    /* Can return the entire array of Candidates, but according to Solidity this should be 
       avoided for arrays that can grow indefinitely in length. */
    function getCandidates() public view returns(Candidate [] memory){
        return candidates;
    }
    
    //join a poll; only once per voter
    function join() public{
        require(
            !voters[msg.sender].joined,
            "Joined already!"
            );
        
        //remembering this address joined
        voters[msg.sender].joined=true;    
    }
    
    //voting
    function vote(uint256 _voteIndex) public{
        //check if the sender has voted already + if he joined the poll 
        require(
            !voters[msg.sender].voted,
            "Voted already!"
            );
        require(
            voters[msg.sender].joined,
            "Join it first!"
            );
        
        //voter needs one token to be able to vote
        require(token.balanceOf(msg.sender) >= 1, "Not enough balance");
        //cast the vote, by sending one token to the Voting contract address
        require(token.transferFrom(msg.sender, address(this), 1));
        
        //voting for candidate at _voteIndex
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
