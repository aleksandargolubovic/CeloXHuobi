import ExpenseService from "./hedera/expenseService/expenseService.js.js";
import { getProvider, getSigner, initHashconnect } from './hedera/providers/hashconnectProvider';

const getAccountBalance = async () => {

  const provider = getProvider();
  const signer = getSigner(provider);
  // Free query
  const balance = await signer.getAccountBalance();
  console.log(`balance: ${balance.hbars.toString()}`);
}