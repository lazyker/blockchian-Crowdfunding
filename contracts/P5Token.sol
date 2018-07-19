pragma solidity ^0.4.24;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure.
 * To use this library you can add a `using SafeERC20 for ERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
  function safeTransfer(ERC20Basic token, address to, uint256 value) internal {
    require(token.transfer(to, value));
  }

  function safeTransferFrom(
    ERC20 token,
    address from,
    address to,
    uint256 value
  )
    internal
  {
    require(token.transferFrom(from, to, value));
  }

  function safeApprove(ERC20 token, address spender, uint256 value) internal {
    require(token.approve(spender, value));
  }
}



contract P5Token is StandardToken {

  string public name;
  string public symbol;
  uint8 public decimals;

  
  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor(uint256 _initSupply, string _name, string _symbol, uint8 _decimals) public {
    totalSupply_ = _initSupply;
    balances[msg.sender] = _initSupply;
    name = _name;
    symbol= _symbol;
    decimals = _decimals;
    
    emit Transfer(0x0, msg.sender, totalSupply_);
  }
}

