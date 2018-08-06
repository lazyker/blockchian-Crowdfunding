pragma solidity ^0.4.23;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

contract CrowdfundingToken is MintableToken {
    string public name;
    string public symbol;

    constructor(
        address _owner, 
        string _name, 
        string _symbol
    ) 
        public 
    {
        owner = _owner;
        name = _name;
        symbol = _symbol;
    }
}