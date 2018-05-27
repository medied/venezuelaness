pragma solidity ^0.4.19;

interface Registry {

  function hasAttribute(address who, string attribute) public view returns (bool);
  function getAttribute(address who, string attribute) public view returns (uint256);

}

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

contract Jurisdiction is Ownable, Registry {

  event ValidatorAdded(address validator);
  event ValidatorRemoved(address validator);

  mapping(address => mapping(string => uint256)) attributes;

  mapping(address => bool) validators;

  modifier onlyValidator() {
    require(isValidator(msg.sender));
    _;
  }

  function addValidator(address validator) public onlyOwner {
    validators[validator] = true;
    ValidatorAdded(validator);
  }

  function removeValidator(address validator) public onlyOwner {
    validators[validator] = false;
    ValidatorRemoved(validator);
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

contract Venezuela is Jurisdiction {

  function validateNationalID(address who) public onlyValidator {
      addAttribute(who, "IsANaturalPerson", 1);
      addAttribute(who, "HoldsANationalID", 1);
  }

  function validateVoteRegistry(address who) public onlyValidator {
      addAttribute(who, "IsRegisteredToVote", 1);
  }

  function holdsANationalID(address who) public view returns (bool) {
      return hasAttribute(who, "HoldsANationalID");
  }

  function isRegisteredToVote(address who) public view returns (bool) {
      return hasAttribute(who, "IsRegisteredToVote");
  }

}
