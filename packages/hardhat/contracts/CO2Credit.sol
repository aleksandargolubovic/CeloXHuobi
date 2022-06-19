// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract CO2Credit is ERC20Burnable {
    constructor(uint256 initialSupply) ERC20("CO2Credit", "CO2") {
        _mint(msg.sender, initialSupply);
    }
}