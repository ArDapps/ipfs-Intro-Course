// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Cloud {
string private ipfsHash;

function saveData(string memory hash) public{
ipfsHash=hash;
}

function getData()public view returns(string memory){
    return ipfsHash;
}

}