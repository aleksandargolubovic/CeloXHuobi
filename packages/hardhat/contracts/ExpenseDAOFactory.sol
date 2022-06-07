// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ExpenseDAO.sol";
import "./Registry.sol";

contract ExpenseDAOFactory {
  Registry public registry;

  constructor(Registry reg) {
    registry = reg;
  }

  function newExpenseOrg(
    string calldata name,
    address stableCoin,
    address[] calldata approvers,
    address[] calldata members)
    external returns (ExpenseDAO r) {

    r = new ExpenseDAO(stableCoin, approvers, members);
    registry.register(name, r, msg.sender);
  }
}