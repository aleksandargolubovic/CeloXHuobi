//import { BigNumber } from '@hashgraph/hethers';
import { useState, useCallback } from 'react';
import { useOnRepetition } from "./useOnRepetition";
// import {
//   getProvider,
//   getSigner } from 'app/services/hedera/providers/hashconnectProvider';

// import instance from "app/services/hedera/expenseService/expenseService";
const getEvents = async (contractID) => {
  if (contractID !== '') {
    //const message = await instance.getEventsFromMirror(contractID);
    //return message;
    return "";
  }
  return '';
  
  // let provider;
  // let signer;
  // try {
  //   provider = getProvider();
  //   signer = getSigner(provider);
  // } catch (e) {
  //   return '0';
  // }

  // // Free query
  // const balance = await signer.getAccountBalance();
  // //console.log(`balance: ${balance.hbars.toString()}`);
  // return balance.hbars.toString();
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
export const useEvents = (contractID, pollTime = 0) => {
    const [contractId, setContractId] = useState(contractID);
    const [message, setMessage] = useState('');
    const pollEvents = useCallback(async () => {
      const newMessage = await getEvents(contractId);
      setMessage(newMessage);
      //setBalance(newBalance);
      // if (!newBalance.eq(balance !== null && balance !== void 0 ? balance : zero)) {
      //     setBalance(newBalance);
      //     console.log(address, newBalance.toString(), balance);
      // }
    }, [message, contractId]);

    useOnRepetition(pollEvents, { pollTime});

    return {
      message,
      setContractId
    };
    //return balance;// !== null && balance !== void 0 ? balance : 0;
};
