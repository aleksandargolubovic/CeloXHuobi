// import {
//   AccountId,
//   AccountBalanceQuery,
//   Client,
//   ContractId,
//   ContractExecuteTransaction,
//   ContractCallQuery,
//   ContractFunctionParameters,
//   Hbar,
//   PrivateKey,
//   TransferTransaction } from "@hashgraph/sdk";

// import Web3 from "web3";
// import refundContract from "../contracts/Refund.json";

// import axios from "axios";

// const NULL_ADDR = "0000000000000000000000000000000000000000";
// const web3 = new Web3();

// const delay = ms => new Promise(res => setTimeout(res, ms));

// class ExpenseService {
//   client;
//   refundABI;
//   // Base contract IDs.
//   registryContractID;
//   refundFactoryContractID;

//   constructor(registryID, refundFactoryID) {
//     const myAccountId = AccountId.fromString(process.env.REACT_APP_MY_ACCOUNT_ID);
//     const myPrivateKey = PrivateKey.fromString(process.env.REACT_APP_MY_PRIVATE_KEY);

//     // If we weren't able to grab it, we should throw a new error
//     if (myAccountId == null || myPrivateKey == null) {
//       throw new Error(
//         "Environment variables myAccountId and myPrivateKey must be present"
//       );
//     }

//     // Create our connection to the Hedera network
//     // The Hedera JS SDK makes this really easy!
//     this.client = Client.forTestnet();
//     this.client.setOperator(myAccountId, myPrivateKey);

//     this.registryContractID = ContractId.fromString(registryID);
//     this.refundFactoryContractID = ContractId.fromString(refundFactoryID);

//     //const refundContract = JSON.parse(fs.readFileSync('./Refund.json', 'utf8'));
//     this.refundABI = refundContract.abi;
//   }

//   // Returns the organization address if it exists in Registry contract.
//   // If not, null address is returned.
//   getOrganizationAddress = async (organizationName) => {
//     console.log("ORGNAME: ", organizationName);
//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     // Calls a function of the smart contract
//     const contractQuery = await new ContractCallQuery()
//     //Set the gas for the query
//     .setGas(100000)
//     //Set the contract ID to return the request for
//     .setContractId(this.registryContractID)
//     //Set the contract function to call
//     .setFunction("refundOrgs", new ContractFunctionParameters().addString(organizationName))
//     //Set the query payment for the node returning the request
//     //This value must cover the cost of the request otherwise will fail
//     .setQueryPayment(new Hbar(2));

//     //Submit to a Hedera network
//     const getMessage = await contractQuery.execute(this.client);

//     // Get a string from the result at index 0
//     const message = getMessage.getAddress(0);
//     const contractAccountId = AccountId.fromSolidityAddress(message);
//     //Log the message
//     console.log("Organization address is: " + contractAccountId);
//     return contractAccountId.toString();
//   }

//   // Creates a new Organization.
//   createNewOrganization = async (name, approvers, members, signer) => {
//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     //Create the transaction
//     const transaction = new ContractExecuteTransaction()
//       .setContractId(this.refundFactoryContractID)
//       .setGas(400000)
//       .setFunction("newRefundOrg", new ContractFunctionParameters()
//         .addString(name)
//         .addAddressArray(
//           approvers.map(a => AccountId.fromString(a).toSolidityAddress()))
//         .addAddressArray(
//           members.map(m => AccountId.fromString(m).toSolidityAddress()))
//       )
//       .freezeWithSigner(signer);
//     try {
//     let txResponse = await (await transaction).executeWithSigner(signer);
//     console.log("RESPONSE", txResponse);
//     if (txResponse) {
//       console.log("OK");
//       return true;
//     }
//     } catch(e) {
//       console.log(e);
//     }
//     return false;
//   }

//   // Refund contract functions.
//   createRequest = async (
//     contractID,
//     description,
//     url,
//     reimbursementAddress,
//     amount,
//     date,
//     category,
//     signer,
//     provider) => {

//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     //Create the transaction
//     let categoryInt = 0;
//     switch (category) {
//       case 'Equipment':
//         categoryInt = 1;
//         break;
//       case 'Home Office':
//         categoryInt = 2;
//         break;
//       case 'Meals and Entertainment':
//         categoryInt = 3;
//         break;
//       case 'Office Supplies':
//         categoryInt = 4;
//         break;
//       case 'Travel':
//         categoryInt = 5;
//         break;
//       case 'Other':
//         categoryInt = 6;
//         break;
//       default:
//         categoryInt = 0;
//     }
    

//     let transaction = new ContractExecuteTransaction()
//       .setContractId(contractID)
//       .setGas(400000)
//       .setFunction("createRequest", new ContractFunctionParameters()
//         .addString(description)
//         .addString(url)
//         .addAddress(
//           AccountId.fromString(reimbursementAddress).toSolidityAddress())
//         .addUint256(new Hbar(amount).toTinybars())
//         .addUint256(date)
//         .addUint8(categoryInt))
//       .freezeWithSigner(signer);

//     // Sign with the client operator private key to pay for the transaction and
//     // submit the query to a Hedera network.
//     try {
//       const txResponse = await (await transaction).executeWithSigner(signer);
//       console.log("createRequest response", txResponse);
//       if (txResponse) {
//         console.log("OK");
//         return true;
//       }
//     } catch(e) {
//       console.log(e);
//     }
//     return false;
//   }

//   // Approve or deny request.
//   // @param {ContractId || string contractID}
//   // @param {uint256 requestId}
//   // @param {bool approved}
//   // @param {HashConnectSigner signer}
//   processRequest = async (
//     contractID,
//     requestId,
//     approved,
//     signer) => {
    
//     if (!signer) {
//       return new Error('Signer is not initialized');
//     }
//     // Create the transaction.
//     let transaction = new ContractExecuteTransaction()
//       .setContractId(contractID)
//       .setGas(300000)
//       .setFunction("processRequest", new ContractFunctionParameters()
//         .addUint256(requestId)
//         .addBool(approved))
//       .freezeWithSigner(signer);
    
//     // Sign with the client operator private key to pay for the transaction and
//     // submit the query to a Hedera network.
//     try {
//       const txResponse = await (await transaction).executeWithSigner(signer);
//       console.log("processRequest response", txResponse);
//       if (txResponse) {
//         console.log("OK");
//         return true;
//       }
//     } catch(e) {
//       console.log(e);
//     }
//     return false;
//   }
  
//   // Send funds to Refund contract.
//   sendFunds = async (
//     contractID,
//     amount,
//     signer) => {

//     if (!signer) {
//       return new Error('Signer is not initialized');
//     }
//     // Create the transaction.
//     // let transaction = new ContractExecuteTransaction()
//     //   .setContractId(contractID)
//     //   .setGas(300000)
//     //   .setPayableAmount(new Hbar(amount))
//     //   .setFunction("receive")
//     //   .freezeWithSigner(signer);
    
//     // Sign with the client operator private key to pay for the transaction and
//     // submit the query to a Hedera network.
//     // const txResponse = await (await transaction).executeWithSigner(signer);
//     // console.log("sendFunds response", txResponse);
//     // return txResponse !== undefined;

//     let transaction = await new TransferTransaction()
//       .addHbarTransfer(signer.accountToSign, new Hbar(amount).negated())
      
//       .addHbarTransfer(contractID, new Hbar(amount))
//       .freezeWithSigner(signer);

//     let txResponse = await transaction.executeWithSigner(signer);
//     console.log("sendFunds response:", txResponse);
//   }

//   // Check whether the signer has "MEMBER" user role.
//   isMember = async (contractID, signer) => {

//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }

//     // Calls a function of the smart contract
//     const contractQuery = new ContractCallQuery()
//       .setGas(300000)
//       .setContractId(contractID)
//       .setFunction("isMember",
//         new ContractFunctionParameters().addAddress(
//           AccountId.fromString(signer.getAccountId()).toSolidityAddress()))
//       .setQueryPayment(new Hbar(2));

//       //Submit to a Hedera network
//     const getMessage = await contractQuery.execute(this.client);

//     // Get a string from the result at index 0
//     const message = getMessage.getBool(0);
//     console.log("isMember returned: " + message);
//     return message;
//   }

//   // Check whether the signer has "APPROVER" user role.
//   isApprover = async (contractID, signer) => {

//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     // Calls a function of the smart contract
//     const contractQuery = new ContractCallQuery()
//       .setGas(100000)
//       .setContractId(contractID)
//       .setFunction("isApprover",
//         new ContractFunctionParameters().addAddress(
//           AccountId.fromString(signer.getAccountId()).toSolidityAddress()))
//       .setQueryPayment(new Hbar(2));

//       //Submit to a Hedera network
//     const getMessage = await contractQuery.execute(this.client);

//     // Get a string from the result at index 0
//     const message = getMessage.getBool(0);
//     console.log("isApprover returned: " + message);
//     return message;
//   }

//   // Helper function that decodes and returns a function result.
//   decodeFunctionResult = (functionName, resultAsBytes) => {
//     const functionAbi = this.refundABI.find(func => func.name === functionName);
//     const functionParameters = functionAbi.outputs;
//     const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
//     const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
//     return result;
//   }

//   // Get all the request for the member.
//   getMembersRequests = async (contractID, signer) => {
//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     // Calls a function of the smart contract
//     const contractQuery = new ContractCallQuery()
//       .setGas(200000)
//       .setContractId(contractID)
//       .setFunction("getMembersRequests",
//         new ContractFunctionParameters().addAddress(
//           AccountId.fromString(signer.getAccountId()).toSolidityAddress()))
//       .setQueryPayment(new Hbar(2));

//     //Submit to a Hedera network
//     const getMessage = await contractQuery.execute(this.client);

//     // Get a string from the result at index 0
//     const message =
//       this.decodeFunctionResult("getMembersRequests", getMessage.bytes);
//     return message;
//   }

//   // Returns all the request for the ogranization with provided ContractID.
//   getRequests = async (contractID) => {
//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     // Calls a function of the smart contract
//     const contractQuery = new ContractCallQuery()
//       .setGas(200000)
//       .setContractId(contractID)
//       .setFunction("getRequests")
//       .setQueryPayment(new Hbar(2));

//       //Submit to a Hedera network
//     const getMessage = await contractQuery.execute(this.client);

//     // Get a string from the result at index 0
//     const message = this.decodeFunctionResult("getRequests", getMessage.bytes);
//     return message;
//   }

//   // Returns a Request with particular requestId.
//   getRequest = async (contractID, requestID) => {
//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     // Calls a function of the smart contract
//     const contractQuery = new ContractCallQuery()
//       .setGas(100000)
//       .setContractId(contractID)
//       .setFunction("getRequest",
//         new ContractFunctionParameters().addUint256(requestID))
//       .setQueryPayment(new Hbar(2));

//       //Submit to a Hedera network
//     const getMessage = await contractQuery.execute(this.client);

//     // Get a string from the result at index 0
//     const message = this.decodeFunctionResult("getRequest", getMessage.bytes);
//     return message;
//   }


//   getContractBalance = async (contractID) => {
//     //Create the account balance query
//     const query = new AccountBalanceQuery()
//       .setContractId(contractID.toString());
//         //"0.0.34716717");
//       //.setAccountId("0.0.34391693");//contractID.toString());
//     //.setContractId(contractID.toString());

//     // Submit the query to a Hedera network
//     const accountBalance = await query.execute(this.client);

//     //Print the balance of hbars
//     console.log("The hbar account balance for this account is " + accountBalance.hbars);
//     return accountBalance.hbars;
//     //v2.0.7
//   }

//   getSummary = async (contractID) => {
//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     // Calls a function of the smart contract
//     const contractQuery = new ContractCallQuery()
//       .setGas(100000)
//       .setContractId(contractID)
//       .setFunction("getSummary")
//       .setQueryPayment(new Hbar(2));

//       //Submit to a Hedera network
//     const getMessage = await contractQuery.execute(this.client);
//     console.log("getMessage", getMessage);

//     // // Get a string from the result at index 0
//     // const message = getMessage.getBool(0);
//     // console.log("isApprover returned: " + message);
//     // return message;
//     const message = this.decodeFunctionResult("getSummary", getMessage.bytes);
//     return message;
//   }

//   decodeEvent = (eventName, log, topics) => {
//     // const functionAbi = this.refundABI.find(func => func.name === functionName);
//     // const functionParameters = functionAbi.outputs;
//     // const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
//     // const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
//     // return result;

//     const eventAbi = this.refundABI.find(
//       event => (event.name === eventName && event.type === "event"));
//     const decodedLog = web3.eth.abi.decodeLog(eventAbi.inputs, log, topics);
//     return decodedLog;
//   }

//   eventsSize = -1;
//   contractId = '';

//   getEventsFromMirror = async(contractId) => {
//     if (!this.client) {
//       return new Error('Client is not initialized');
//     }
//     console.log(`\nGetting event(s) from mirror`);
//     //console.log(`Waiting 10s to allow transaction propagation to mirror`);
//     //await delay(10000);

//     const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractId.toString()}/results/logs?order=asc`;

//     try {
//       const response = await axios.get(url);
//        // .then(function (response) {
//       const jsonResponse = response.data;
//       console.log(jsonResponse);
  
//       //Skip first call. Just save the log size.
//       if (this.eventsSize === -1 || this.contractId !== contractId) {
//         this.eventsSize = jsonResponse.logs.length;
//         this.contractId = contractId;
//         return '';
//       }

//       if (this.eventsSize < jsonResponse.logs.length) {
//         this.eventsSize = jsonResponse.logs.length;
//         const log = jsonResponse.logs[jsonResponse.logs.length -1];
//         if (log.topics.length === 2) {
//           const event = this.decodeEvent("NewRequestCreated", log.data, log.topics.slice(1));
//           // output the from address and message stored in the event
//           const message = `New request created! from '
//             ${AccountId.fromSolidityAddress(event.member).toString()}
//             ' amount: '${Hbar.fromTinybars(event.amount).toString()}'`;
//           console.log(`NewRequestCreated Mirror event(s): from '${AccountId.fromSolidityAddress(event.member).toString()}' amount: '${event.amount}'`);
//           return message;
//         } else if (log.topics.length === 3) {
//           const event = this.decodeEvent("PaymentTransfered", log.data, log.topics.slice(1));
//           // output the from address and message stored in the event
//           const message = `Request approved! from '
//             ${AccountId.fromSolidityAddress(event.approver).toString()}
//             ' amount: '${Hbar.fromTinybars(event.amount).toString()}'`;
//          // console.log(`PaymentTransfered Mirror event(s): from '
//            // ${AccountId.fromSolidityAddress(event.approver).toString()}' amount: '${event.amount}'`);
//           console.log(message);
//            return message;
//         }
        
//       }


//       // event NewRequestCreated(address indexed member, uint256 amount);
//       // event PaymentTransfered(
//       //   address indexed approver,
//       //   address indexed reimbursementAddress,
//       //   uint256 amount);

//       // jsonResponse.logs.forEach(log => {
//       //   // decode the event data
//       //   if (log.data.length > 5) {
//       //     const event = this.decodeEvent("NewRequestCreated", log.data, log.topics.slice(1));
//       //     // output the from address and message stored in the event
//       //   const message = `Mirror event(s): from '${AccountId.fromSolidityAddress(event.member).toString()}' amount: '${event.amount}'`;
//       //   console.log(`Mirror event(s): from '${AccountId.fromSolidityAddress(event.member).toString()}' amount: '${event.amount}'`);
//       //   return message;
//       //   }
        
//       // });
//     }
//     catch(err) {
//       console.error(err);
//     };
//     // axios.get(url)
//     //   .then(function (response) {
//     //     const jsonResponse = response.data;
//     //     console.log(jsonResponse);

//     //     jsonResponse.logs.forEach(log => {
//     //       // decode the event data
//     //       const event = this.decodeEvent("BalanceIncreased", log.data, log.topics.slice(1));

//     //       // output the from address and message stored in the event
//     //       message = `Mirror event(s): from '${AccountId.fromSolidityAddress(event.fromAddress).toString()}' amount: '${event.amount}'`;
//     //       console.log(`Mirror event(s): from '${AccountId.fromSolidityAddress(event.fromAddress).toString()}' amount: '${event.amount}'`);
//     //       return message;
//     //     });
//     //   })
//     //   .catch(function (err) {
//     //     console.error(err);
//     //   });
//   }
// }

// const instance = new ExpenseService(
//   process.env.REACT_APP_EXPENSE_REGISTRY_CONTRACT_ID,
//   process.env.REACT_APP_EXPENSE_FACTORY_CONTRACT_ID);
//   //"0.0.34716691", "0.0.34716693");
// //const instance = new ExpenseService("0.0.34716714", "0.0.34716716");

// export default instance;