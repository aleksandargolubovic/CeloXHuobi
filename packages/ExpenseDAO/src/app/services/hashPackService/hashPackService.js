// // import {
// //   deleteLocalData,
// //   getProvider,
// //   getSigner,
// //   getSaveData,
// //   initHashconnect,
// //   setLoginCallback } from '../hedera/providers/hashconnectProvider';

// import { useCelo } from '@celo/react-celo';

// const { connect, address } = useCelo();

// class HashPackService {
  

//   login = async () => {
//     if (address) {
//       console.log(`Connected to ${address}`);
//     } else {
//       connect();
//     }
//   };

//   register = () => {
//     return this.lock.show({
//       initialScreen: 'signUp',
//     });
//   };

//   onAuthenticated = (callback) => {
//     setLoginCallback(callback);
//     //return this.lock.on('authenticated', callback);
//   };

//   logout = () => {
//     // Clear access token and ID token from local storage
//     //deleteLocalData();
//   };

//   isAuthenticated = () => {
//     return address !== null;//getSaveData().pairedWalletData !== null;
//   };

//   getUserData = () => {
//     return new Promise((resolve, reject) => {
//       const tokenData = {
//         username: "",
//         name: account,//getSaveData().pairedAccounts[0],
//         photoURL: "",
//         email: "HashPack account",
//       };
      
//       resolve(tokenData);
//     });
//   };

//   updateUserData = (userMetadata) => {
//     // const tokenData = this.getTokenData();
//     // const { sub: userId } = tokenData;

//     // const auth0UserUrl = `https://${AUTH_CONFIG.domain}/api/v2/users/${userId}`;
//     // const dataObj = JSON.stringify({ user_metadata: userMetadata });

//     // return axios.patch(auth0UserUrl, dataObj, {
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //     Authorization: `Bearer ${this.getAccessToken()}`,
//     //   },
//     // });
//   };

//   // getAccessToken = () => {
//   //   return localStorage.getItem('access_token');
//   // };

//   // getIdToken = () => {
//   //   return window.localStorage.getItem('id_token');
//   // };

//   // getTokenData = () => {
//   //   const token = this.getIdToken();
//   //   const decoded = jwtDecode(token);
//   //   if (!decoded) {
//   //     return null;
//   //   }
//   //   return decoded;
//   // };

//   // setUpEvents = () => {

//   //   this.hashconnect.foundExtensionEvent.on((data) => {
//   //       this.availableExtensions.push(data);
//   //       console.log("Found extension", data);
//   //   })
  
  
//   //   // this.hashconnect.additionalAccountResponseEvent.on((data) => {
//   //   //     console.log("Received account info", data);
        
//   //   //     data.accountIds.forEach(id => {
//   //   //         if(this.saveData.pairedAccounts.indexOf(id) == -1)
//   //   //             this.saveData.pairedAccounts.push(id);
//   //   //     })
//   //   // })
  
//   //   this.hashconnect.pairingEvent.on((data) => {
//   //       console.log("Paired with wallet", data);
//   //       //status = "Paired";
  
//   //       this.saveData.pairedWalletData = data.metadata;
  
//   //       data.accountIds.forEach(id => {
//   //           if(this.saveData.pairedAccounts.indexOf(id) == -1)
//   //             this.saveData.pairedAccounts.push(id);
//   //       })
  
//   //       this.saveDataInLocalstorage();
//   //       this.status = "LOGGEDIN";
//   //       if (this.callbackSuccess) {
//   //         this.callbackSuccess();
//   //       }
        
//   //   });
  
  
//   //   this.hashconnect.transactionEvent.on((data) => {
//   //       //this will not be common to be used in a dapp
//   //       console.log("transaction event callback");
//   //   });
//   // }  
// }

// const instance = new HashPackService();

// export default instance;
