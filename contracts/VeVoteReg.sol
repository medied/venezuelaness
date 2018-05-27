pragma solidity ^0.4.0;


// UID = html(http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=11111111).xpath(/html/body/table/tr/td/table/tr[5]/td/table/tr[2]/td/table/tr[1]/td[2]/text())
// NAME(all) = html(http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=11111111).xpath(/html/body/table/tr/td/table/tr[5]/td/table/tr[2]/td/table/tr[2]//*[1]//text())
// NAME(no special char) = html(http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=11111112).xpath(/html/body/table/tr/td/table/tr[5]/td/table/tr[2]/td/table/tr[2]/td[2]/b/text())
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract Controlled {
    /// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController { 
        require(msg.sender == controller); 
        _; 
    }

    address public controller;

    function Controlled() internal { 
        controller = msg.sender; 
    }

    /// @notice Changes the controller of the contract
    /// @param _newController The new controller of the contract
    function changeController(address _newController) public onlyController {
        controller = _newController;
    }
}


contract VeVoteReg is Controlled, usingOraclize {

    event Registered(address indexed oracle, bytes32 uidHash);
    event Debug(string s);    
    mapping (bytes32 => bytes32) registry;
    mapping (bytes32 => bytes32) oraclizePending;
    
    string public nameUrlprefix = "html(http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=";
    string public nameUrlsuffix = ").xpath(/html/body/table/tr/td/table/tr[5]/td/table/tr[2]/td/table/tr[1]/td[2]/text())";

    function registerByAuthority(string uid, bytes32 hashValue) external onlyController {
        setRegistry(keccak256(uid),hashValue);
    } 

    function registerByOracle(string uid) public payable {
        bytes32 regid = keccak256(uid);
        oraclizePending[oraclize_query("URL", strConcat(nameUrlprefix, uid, nameUrlsuffix))] = regid;
    }
    
    function __callback(bytes32 myid, string result) public {
        require (msg.sender == oraclize_cbAddress());
        require(oraclizePending[myid] != 0);
        if(bytes(result).length != 0) {
            setRegistry(oraclizePending[myid], keccak256(result));
        }
        
        delete oraclizePending[myid];
    }

    function isRegistered(string uid) external view returns(bool) {
        return registry[keccak256(uid)] != 0;
    }

    function setRegistry(bytes32 uidHash, bytes32 nameHash) private {
        if(registry[uidHash] == 0) {
            registry[uidHash] = nameHash;
            Registered(msg.sender, uidHash);
        }
    }
}
