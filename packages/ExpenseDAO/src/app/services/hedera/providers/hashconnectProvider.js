// import { HashConnect } from 'hashconnect';

// let hashconnect;
// let availableExtensions = [];
// let loginCallback;
// let status = "LOGGED_OUT";

// let firstTime = true;

// let saveData = {
//   topic: "",
//   pairingString: "",
//   privateKey: "",
//   pairedWalletData: null,
//   pairedAccounts: []
// }

// let appMetadata = {
//   name: "ExpenseDAO",
//   description: "An expense maanagement system for DAOs",
//   icon: "https://www.hashpack.app/img/logo.svg"
// }

// export async function initHashconnect() {
//   //create the hashconnect instance
//   if (!hashconnect) {
//     hashconnect = new HashConnect();
//   }
  
//   if(!loadLocalData()){
//     //first init and store the private for later
//     let initData = await hashconnect.init(appMetadata);
//     saveData.privateKey = initData.privKey;
//     //console.log("INIT1", saveData);

//     //then connect, storing the new topic for later
//     const state = await hashconnect.connect();
//     saveData.topic = state.topic;
    
//     //console.log("INIT2", saveData);
//     //generate a pairing string, which you can display and generate a QR code from
//     saveData.pairingString =
//       hashconnect.generatePairingString(state, "testnet", true);
    
//     //find any supported local wallets
//     hashconnect.findLocalWallets();
//     //console.log("INIT3", saveData);
//   }
//   else {
//     //use loaded data for initialization + connection
//     console.log("ALREADY EXISTS");
//     await hashconnect.init(appMetadata, saveData.privateKey);
//     await hashconnect.connect(saveData.topic, saveData.pairedWalletData);
//   }
//   setUpEvents();
//   const ret = await connectToExtension();
//   console.log("ret:", ret);
// }

// function loadLocalData() {
//   let foundData = localStorage.getItem("hashconnectData");

//   if(foundData){
//     saveData = JSON.parse(foundData);
//     return true;
//   }
//   else
//     return false;
// }

// export function deleteLocalData() {
//   status = "LOGGED_OUT";
//   hashconnect = null;
//   //localStorage.removeItem('hashconnectData');
// }

// function setUpEvents() {

//   hashconnect.foundExtensionEvent.on((data) => {
//     availableExtensions.push(data);
//     console.log("Found extension", data);
//   })


//   // this.hashconnect.additionalAccountResponseEvent.on((data) => {
//   //     console.log("Received account info", data);
      
//   //     data.accountIds.forEach(id => {
//   //         if(this.saveData.pairedAccounts.indexOf(id) == -1)
//   //             this.saveData.pairedAccounts.push(id);
//   //     })
//   // })

//   hashconnect.acknowledgeMessageEvent.once((acknowledgeData) => {
//     // do something with acknowledge response data
//     console.log("Acknowledge data:", acknowledgeData);
//   });

//   hashconnect.pairingEvent.on((data) => {
//     console.log("Paired with wallet", data);

//     saveData.pairedWalletData = data.metadata;

//     data.accountIds.forEach(id => {
//       if(saveData.pairedAccounts.indexOf(id) == -1)
//         saveData.pairedAccounts.push(id);
//     })
//     saveDataInLocalstorage();
//     //console.log("LOGINaaaaa", loginCallback);
//     status = "LOGGED_IN";
//     if (loginCallback) {
//       //console.log("OOOOOOOOOOO");
//       loginCallback(status);
//     }
//   });

//   hashconnect.transactionEvent.on((data) => {
//     //this will not be common to be used in a dapp
//     console.log("transaction event callback");
//   });
// }


// function saveDataInLocalstorage() {
//   let data = JSON.stringify(saveData);
  
//   localStorage.setItem("hashconnectData", data);
// }

// async function connectToExtension() {
//   hashconnect.connectToLocalWallet(saveData.pairingString);
// }

// export function getProvider() {
//   let provider = hashconnect
//     .getProvider("testnet", saveData.topic, saveData.pairedAccounts[0]);

//   return provider;
// }

// export function getSigner(provider) {
//   return hashconnect.getSigner(provider);
// }

// export function getSaveData() {
//   return saveData;
// }

// export function setLoginCallback(callbackSuccess) {
//   loginCallback = callbackSuccess;
//   //console.log("LOGINCALLBACK SET");
// }