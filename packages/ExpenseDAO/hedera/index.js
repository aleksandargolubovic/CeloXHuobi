import {
  AccountId,
  Client,
  ContractId,
  FileAppendTransaction,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  Hbar,
  PrivateKey } from "@hashgraph/sdk";
//require("dotenv").config();
//import { config } from "dotenv";
import "dotenv/config.js";
import registry from "./artifacts/Registry.json";
import refundFactory from "./artifacts/RefundFactory.json";

async function main() {
  //Grab your Hedera testnet account ID and private key from your .env file
  const MY_ACCOUNT_ID = "your account id"
  const MY_PRIVATE_KEY = "your private key"

  const myAccountId = AccountId.fromString(MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(MY_PRIVATE_KEY);

  // If we weren't able to grab it, we should throw a new error
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      "Environment variables myAccountId and myPrivateKey must be present"
    );
  }

  // Create our connection to the Hedera network
  // The Hedera JS SDK makes this really easy!
  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  // 1. Deploy Registry
  //Import the compiled contract from the Registry.json file
  //let registry = require("./artifacts/HelloHedera.json");
  //let registry = require("./artifacts/Registry.json");
  
  //const registryBytecode = registry.data.bytecode.object;
  const registryBytecode = registry.bytecode;
  //Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction()
    //Set the bytecode of the contract
    .setContents(registryBytecode);

  //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
  const submitTx = await fileCreateTx.execute(client);

  //Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  //Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  //Log the file ID
  console.log("The smart contract byte code file ID is " + bytecodeFileId)

  // Instantiate the contract instance
  const contractTx = await new ContractCreateTransaction()
    //Set the file ID of the Hedera file storing the bytecode
    .setBytecodeFileId(bytecodeFileId)
    //Set the gas to instantiate the contract
    .setGas(100000)
    // //Provide the constructor parameters for the contract
   // .setConstructorParameters(new ContractFunctionParameters().addString("Hello from Hedera!"));

  //Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client);

  //Get the receipt of the file create transaction
  const contractReceipt = await contractResponse.getReceipt(client);

  //Get the smart contract ID
  const newContractId = contractReceipt.contractId;
  const registryContractAddress = newContractId.toSolidityAddress();

  //Log the smart contract ID
  console.log("The smart contract ID is " + newContractId);
  console.log("Registry contract ID: " + newContractId, "Registry byte code file ID: " + bytecodeFileId);

  // const newContractId = ContractId.fromString("0.0.34706788");
  // // Calls a function of the smart contract
  // const contractQuery = await new ContractCallQuery()
  // //Set the gas for the query
  // .setGas(100000)
  // //Set the contract ID to return the request for
  // .setContractId(newContractId)
  // //Set the contract function to call
  // .setFunction("refundOrgs", new ContractFunctionParameters().addString("test"))//get_message" )
  // //Set the query payment for the node returning the request
  // //This value must cover the cost of the request otherwise will fail
  // .setQueryPayment(new Hbar(2));

  // //Submit to a Hedera network
  // const getMessage = await contractQuery.execute(client);

  // // Get a string from the result at index 0
  // const message = getMessage.getAddress(0);

  // //Log the message
  // console.log("The contract message: " + message);

  //v2 Hedera JavaScript SDK

//  //Create the transaction to update the contract message
//  const contractExecTx = await new ContractExecuteTransaction()
//  //Set the ID of the contract
//  .setContractId(newContractId)
//  //Set the gas for the contract call
//  .setGas(100000)
//  //Set the contract function to call
//  .setFunction("register",
//   new ContractFunctionParameters()
//     .addString("Hello2")
//     .addAddress(newContractId.toSolidityAddress())
//     .addAddress(myAccountId.toSolidityAddress()));

// //Submit the transaction to a Hedera network and store the response
// const submitExecTx = await contractExecTx.execute(client);

// //Get the receipt of the transaction
// const receipt2 = await submitExecTx.getReceipt(client);

// //Confirm the transaction was executed successfully 
// console.log("The transaction status is " +receipt2.status.toString());

// //Query the contract for the contract message
// const contractCallQuery = new ContractCallQuery()
//  //Set the ID of the contract to query
//  .setContractId(newContractId)
//  //Set the gas to execute the contract call
//  .setGas(100000)
//  //Set the contract function to call
//  .setFunction("get_message")
//  //Set the query payment for the node returning the request
//  //This value must cover the cost of the request otherwise will fail 
//  .setQueryPayment(new Hbar(10));

// //Submit the transaction to a Hedera network 
// const contractUpdateResult = await contractCallQuery.execute(client);

// //Get the updated message at index 0
// const message2 = contractUpdateResult.getString(0);

// //Log the updated message to the console
// console.log("The updated contract message: " + message2);

//v2 Hedera JavaScript SDK

  

  // 2. Deploy RefundFactory
  // let refundFactory = require("./artifacts/RefundFactory.json");
  const refundFactoryBytecode = refundFactory.bytecode;

  //Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx2 = new FileCreateTransaction().setKeys([myPrivateKey]);
  const fileSubmit = await fileCreateTx2.execute(client);
  const fileCreateRx = await fileSubmit.getReceipt(client);
  const bytecodeFileId2 = fileCreateRx.fileId;
  console.log(`- The smart contract bytecode file ID is: ${bytecodeFileId2}`);

  // Append contents to the file
  const fileAppendTx = new FileAppendTransaction()
    .setFileId(bytecodeFileId2)
    .setContents(refundFactoryBytecode)
    .setMaxChunks(10)
    .setMaxTransactionFee(new Hbar(2));
  const fileAppendSubmit = await fileAppendTx.execute(client);
  const fileAppendRx = await fileAppendSubmit.getReceipt(client);
  console.log(`- Content added: ${fileAppendRx.status} \n`);

  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId2)
    .setGas(3000000)
    .setConstructorParameters(new ContractFunctionParameters().addAddress(registryContractAddress));
  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
  const refundFactoryContractId = contractInstantiateRx.contractId;
  const contractAddress = refundFactoryContractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${refundFactoryContractId}`);
  console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);
  console.log("RefundFactory contract ID: " + refundFactoryContractId,
    "RefundFactory byte code file ID: " + bytecodeFileId2);

}

main();
//service();

// The smart contract byte code file ID is 0.0.34370474
// The smart contract ID is 0.0.34370482
// Registry contract ID: 0.0.34370482 Registry byte code file ID: 0.0.34370474
// - The smart contract bytecode file ID is: 0.0.34370483
// - Content added: SUCCESS 

// - The smart contract ID is: 0.0.34370491
// - The smart contract ID in Solidity format is: 00000000000000000000000000000000020c73bb 

// RefundFactory contract ID: 0.0.34370491 Registry byte code file ID: 0.0.34370483