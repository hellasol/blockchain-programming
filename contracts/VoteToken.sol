import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

pragma solidity >=0.4.22 <0.9.0;

contract VoteToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("VoteToken", "VOTE") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    //allows users with the minter role to mint tokens
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
