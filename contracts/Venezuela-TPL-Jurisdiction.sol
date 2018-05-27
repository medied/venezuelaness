// Published on-chain at 0xf26e6e566aa7d315a8bad529c4ef1798c35e13f2 (Rinkeby)
// Address that manages the jurisdiction (owner): 0x3ccc68c456c17ce3ad32d16a3375c3eb25df1141
// DemocracyEarth's address (a validator): 0xe03c8923cDeA5580C6fef73A27525dB22CE26856
// (you can verify that the address above is a validator by using the
// isValidator method)
// You can also verify that the address
// 0xd7d0c397E02DeB8Fb508d7855749a703ab73e5c1 has the attributes
// "isANaturalPerson", "isAnIDHolder", and "isRegisteredToVote"

interface Registry {

  function hasAttribute(address who, string attribute) public view returns (bool);
  function getAttribute(address who, string attribute) public view returns (uint256);

}

// File: zeppelin-solidity/contracts/ownership/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

// File: contracts/tpl-contracts/Jurisdiction.sol

contract Jurisdiction is Ownable, Registry {

  mapping(address => mapping(string => uint256)) attributes;

  // Participants in the Venezuela jurisdiction can have the following attributes: 
  // "isANaturalPerson"
  // "isAnIDHolder"
  // "isRegisteredToVote"

  mapping(address => bool) validators;

  modifier onlyValidator() {
    require(isValidator(msg.sender));
    _;
  }

  function addValidator(address validator) public onlyOwner {
    validators[validator] = true;
  }

  function removeValidator(address validator) public onlyOwner {
    validators[validator] = false;
  }

  function isValidator(address who) public view returns (bool) {
    return validators[who];
  }

  function addAttribute(address who, string attribute, uint256 value) public onlyValidator {
    attributes[who][attribute] = value;
  }
  
  function hasAttribute(address who, string attribute) public view returns (bool)  {
    return attributes[who][attribute] != 0;
  }

  function getAttribute(address who, string attribute) public view returns (uint256) {
    return attributes[who][attribute];
  }
}
