// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "./ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ABCD is ERC20("ABCD", "ABCD") {
    using ECDSA for bytes32;

    address public owner;
    uint public mintNonce;
    
    constructor(){
        owner = msg.sender;
    }

    function mint(uint _amount, bytes memory _sig) external {
        address signer = getMintHash(msg.sender, _amount).toEthSignedMessageHash().recover(_sig);
        require(signer == owner, "onlyOwner");
        _mint(msg.sender, _amount);
    }

    function getMintHash(address _address, uint _amount) public view returns (bytes32){
        return keccak256(abi.encodePacked("mint ABCD", block.chainid, _address, _amount, mintNonce));
    }
}


