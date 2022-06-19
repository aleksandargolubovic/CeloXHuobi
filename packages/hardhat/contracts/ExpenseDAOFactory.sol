// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ExpenseDAO.sol";
import "./Registry.sol";

contract ExpenseDAOFactory {
  Registry public registry;
  address private co2Token;

  constructor(Registry reg, address co2TokenAddress) {
    registry = reg;
    co2Token = co2TokenAddress;
  }

  function newExpenseOrg(
    string calldata name,
    address stableCoin,
    address[] calldata approvers,
    address[] calldata members)
    external returns (ExpenseDAO r) {

    r = new ExpenseDAO(stableCoin, co2Token, approvers, members);
    registry.register(name, r, msg.sender);
  }
}