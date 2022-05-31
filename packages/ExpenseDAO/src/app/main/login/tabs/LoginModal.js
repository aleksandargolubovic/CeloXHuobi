import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserDataHashPack } from 'app/auth/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useCelo } from '@celo/react-celo';
//import '@celo/react-celo/lib/styles.css';

function LoginModal(props) {
  const { connect, address } = useCelo();



  return (
    <>
      {connect}
    </>
    
    // if (address) {
    //   console.log(`Connected to ${address}`);
    // } else {
    //   console.log("test");
    //   const a = await connect();
    //   console.log('aaa', a);
    //   setStatus("LOGGED_IN");//!status);
    //   // await connect().then(() => {
    //   //   setStatus("LOGGED_IN");//!status);
    //   // });
    // } 
  );
}

export default LoginModal;