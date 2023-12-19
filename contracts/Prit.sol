// SPDX-License-Identifer: GPL-2.0-or-later

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Prit is ERC20, Ownable {

    constructor() ERC20("Prit", "PriX") {
        _mint(msg.sender, 700000 * 10 ** decimals());
    }   

}
