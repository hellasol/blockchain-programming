// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./VoteToken.sol";

contract Voting {

    //event that will be logged on the blockchain
    event _PollCreated(string pollName, string description, uint256 indexed pollID, address indexed creator);

    //own data structure to define a poll
    struct Poll {
        address owner;
        string pollName;
        string description;
        uint256 totalVotes;
        uint256 expirationDate;
        bool open;
        //define key-value voters map, i.e. each voter has an address
        mapping(address => Voter) voters;
        Candidate [] candidates;
    }
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    struct Voter {
        bool authorized;
        bool voted;
        uint256 vote;
    }
    
    //define key-value polls map, i.e. each poll with its own id
    mapping(uint => Poll) public polls;
    uint public pollID;
    
    //the ERC20 tokens used for voting
    VoteToken public token;

    //check if it's the owner
    modifier ownerOnly(uint256 id){
        require(msg.sender==polls[id].owner, "Only the owner can do this");
        //execute function if owner condition was met
        _;
    }

    //check if the expirationDate has been passed
    modifier timerOver(uint256 id){
        require(block.timestamp <= polls[id].expirationDate, "Poll not valid anymore");
        //execute function if the poll is still valid
        _;
    }

    //create the new contract (on deployment)
    constructor(address _token) {
        //make sure no zero address is used to create the vote token
        require(_token != address(0) && address(token) == address(0));
        token = VoteToken(_token);
    }  

    //create a new poll with name, description, 2 candidates and make it open/private
    function createPoll(string memory _pollName, string memory _description, string memory _candidate1, string memory _candidate2, bool _open) public returns (uint256){
        pollID = pollID + 1;

        Poll storage newPoll = polls[pollID];
        newPoll.owner = msg.sender;
        newPoll.pollName = _pollName;
        newPoll.description = _description;
        newPoll.totalVotes = 0;
        newPoll.expirationDate = block.timestamp + 30 minutes;
        newPoll.open = _open;

        //by default 2 candidates
        polls[pollID].candidates.push(Candidate(_candidate1,0));
        polls[pollID].candidates.push(Candidate(_candidate2,0));
        
        //trigger _PollCreated event  
        emit _PollCreated(_pollName, _description, pollID, msg.sender);
        return pollID;
    }
    
    //get the number of candidates for the current poll
    function getNumCandidate(uint256 _pollID) timerOver(_pollID) public view returns(uint256) {
        return polls[_pollID].candidates.length;
    }
    
    /* Returns the entire array of Candidates for the current poll, but according to Solidity this should be 
    avoided for arrays that can grow indefinitely in length. */
    function getCandidates(uint256 _pollID) public view returns(Candidate [] memory){
        return polls[_pollID].candidates;
    }

    //autherize addressess manually
    function authorize(uint256 _pollID, address _person) ownerOnly(_pollID) timerOver(_pollID) public {
        polls[_pollID].voters[_person].authorized = true;
    }
    
    //join Poll with _pollID, only once per voter
    function joinPoll(uint256 _pollID) timerOver(_pollID) public{
        require(!polls[_pollID].voters[msg.sender].authorized,"You're authorized already!");
        require(polls[_pollID].open, "This is only for authorized people");
        //remembering this address joined in this poll
        polls[_pollID].voters[msg.sender].authorized=true;
    }
    
    //vote for specific candidate in specific poll
    function vote(uint256 _pollID, uint256 _voteIndex) timerOver(_pollID) public{
        require(polls[_pollID].voters[msg.sender].authorized = true, "You're not authorized to do this. Join or request authorization from the owner");        
        require(!polls[_pollID].voters[msg.sender].voted, "Voted already!");
        
        //voter needs one token to be able to vote
        require(token.balanceOf(msg.sender) >= 1, "Not enough balance");
        //cast the vote, by sending one token to the Voting contract address
        require(token.transferFrom(msg.sender, address(this), 1));
       
        //voting is for candidate at _voteIndex for the poll with _pollID
        polls[_pollID].voters[msg.sender].vote=_voteIndex;
        //by now voted
        polls[_pollID].voters[msg.sender].voted=true;
        //candidate at _voteIndex got one vote
        polls[_pollID].candidates[_voteIndex].voteCount+=1;
        //total votes for this poll
        polls[_pollID].totalVotes+=1;
    }    
    
}