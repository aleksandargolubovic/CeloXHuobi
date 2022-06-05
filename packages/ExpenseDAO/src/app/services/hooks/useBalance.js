import { useState, useCallback } from 'react';
import { useOnRepetition } from "./useOnRepetition";
import { BigNumber } from 'bignumber.js';

const zero = BigNumber(0);
/**
 * Gets your balance from given address and provider
 *
 * ~ Features ~
  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
 * @param provider (ethers->Provider)
 * @param address (string)
 * @param pollTime (number) :: if >0 use polling, else use instead of onBlock event
 * @returns (Bignumber) ::  current balance
 */
export const useBalance = (provider, address, pollTime = 0) => {
  const [balance, setBalance] = useState({CELO: zero, cEUR: zero, cREAL: zero, cUSD: zero});
    const pollBalance = useCallback(async (provider, address) => {
        if (provider && address) {
            const newBalance = await provider.getTotalBalance(address);
            if (newBalance !== balance) {
                setBalance(newBalance);
            }
        }
    }, [balance]);
    useOnRepetition(pollBalance, { pollTime}, provider, address);
    return balance;
};
