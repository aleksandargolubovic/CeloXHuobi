/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type NewOrganizationRegistered = ContractEventLog<{
  organization: string;
  createdBy: string;
  name: string;
  0: string;
  1: string;
  2: string;
}>;

export interface Registry extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Registry;
  clone(): Registry;
  methods: {
    organizations(arg0: string): NonPayableTransactionObject<string>;

    register(
      name: string,
      newOrganization: string,
      createdBy: string
    ): NonPayableTransactionObject<void>;
  };
  events: {
    NewOrganizationRegistered(
      cb?: Callback<NewOrganizationRegistered>
    ): EventEmitter;
    NewOrganizationRegistered(
      options?: EventOptions,
      cb?: Callback<NewOrganizationRegistered>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(
    event: "NewOrganizationRegistered",
    cb: Callback<NewOrganizationRegistered>
  ): void;
  once(
    event: "NewOrganizationRegistered",
    options: EventOptions,
    cb: Callback<NewOrganizationRegistered>
  ): void;
}
