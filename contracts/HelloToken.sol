pragma solidity ^0.4.4;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract HelloToken is Ownable, PausableToken {
    string constant public name = "HelloToken";
    string constant public symbol = "HELLO";
    // solhint-disable-next-line
    uint8 constant public decimals = 18; // 18 decimals is the strongly suggested default, avoid changing it


    /**
     @dev this event generates a public event on the blockchain that will notify clients
    **/
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     @dev this event notifies clients about the amount burnt
    **/
    event Burn(address indexed from, uint256 value);

     /**
     @dev Constrctor function
          Initializes contract with initial supply tokens to the creator of the contract and
          allocates restriceted amount of tokens to some addresses
    */
    constructor() public {
        totalSupply_ = (500 * 10 ** 6) * 10 ** uint256(decimals);
        balances[msg.sender] = totalSupply_;
    }

    /**
     * @dev Burns a specific amount of tokens.
     * @param _value The amount of token to be burned.
     */
    function burn(uint256 _value) public whenNotPaused {
        _burn(msg.sender, _value);
    }

    /**
     * @dev Burns a specific amount of tokens from the target address and decrements allowance
     * @param _from address The address which you want to send tokens from
     * @param _value uint256 The amount of token to be burned
     */
    function burnFrom(address _from, uint256 _value) public whenNotPaused {
        require(_value <= allowed[_from][msg.sender]);
      // Should https://github.com/OpenZeppelin/zeppelin-solidity/issues/707 be accepted,
      // this function needs to emit an event with the updated approval.
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Approval(_from, msg.sender, allowed[_from][msg.sender]);
        _burn(_from, _value);
    }

    function _burn(address _who, uint256 _value) internal whenNotPaused{
        require(_value <= balances[_who]);
      // no need to require value <= totalSupply, since that would imply the
      // sender's balance is greater than the totalSupply, which *should* be an assertion failure

        balances[_who] = balances[_who].sub(_value);
        totalSupply_ = totalSupply_.sub(_value);
        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value);
    }
}