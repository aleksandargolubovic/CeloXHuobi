//import { BigNumber } from '@hashgraph/hethers';
import { useState, useCallback } from 'react';
import { useOnRepetition } from "./useOnRepetition";
// import { Hbar } from "@hashgraph/sdk";
// import {
//   getProvider,
//   getSigner } from 'app/services/hedera/providers/hashconnectProvider';

const getAccountBalance = async () => {
  let provider;
  let signer;
  // try {
  //   provider = getProvider();
  //   signer = getSigner(provider);
  // } catch (e) {
  //   return '0';
  // }

  // Free query
  // const balance = await signer.getAccountBalance();
  // //console.log(`balance: ${balance.hbars.toString()}`);
  // return balance.hbars.toBigNumber();
}
/**
 * Gets your balance in Hbar from given address and provider
 *
 * ~ Features ~
  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
 * @param provider (hethers->Provider)
 * @param address (string)
 * @param pollTime (number) :: if >0 use polling, else use instead of onBlock event
 * @returns (Bignumber) ::  current balance
 */
export const useBalance = (pollTime = 0) => {
    // const [balance, setBalance] = useState((new Hbar(0)).toBigNumber());
    // const pollBalance = useCallback(async () => {
    //   const newBalance = await getAccountBalance();
    //   setBalance(newBalance);
    //   // if (!newBalance.eq(balance !== null && balance !== void 0 ? balance : zero)) {
    //   //     setBalance(newBalance);
    //   //     console.log(address, newBalance.toString(), balance);
    //   // }
    // }, [balance]);
    // useOnRepetition(pollBalance, { pollTime});
    // return balance;// !== null && balance !== void 0 ? balance : 0;
};
