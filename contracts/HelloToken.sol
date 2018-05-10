pragma solidity ^0.4.4;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract HelloToken is StandardToken{

  string public name = "HelloToken";
  string public symbol = "HELLO";
  uint8 public decimal = 2;

  uint public INITIAL_SUPPLY = 500000000;

  constructor() public {
    // constructor
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
