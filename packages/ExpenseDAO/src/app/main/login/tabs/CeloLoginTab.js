import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserDataHashPack } from 'app/auth/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useCelo } from '@celo/react-celo';
import 'styles/styles.css';


function CeloLoginTab(props) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  const { connect, address } = useCelo();

  useEffect(() => {
    if (status === "LOGGED_IN") {
      const tokenData = {
        username: "",
        name: address,
        photoURL: "",
        email: "CELO account",
      };
      dispatch(setUserDataHashPack(tokenData));
      dispatch(showMessage({ message: 'Logged in with CELO' }));
    }
  }, [dispatch, status]);

  async function showDialog() {
    if (address) {
      console.log(`Connected to ${address}`);
      setStatus("LOGGED_IN");
    } else {
      console.log("test");
      const a = await connect();
      console.log('aaa', a);
      setStatus("LOGGED_IN");
    } 
  }

  return (
    <div className="w-full">
      <Button className="w-full my-48" color="primary" variant="contained" onClick={showDialog}>
        Connect your wallet
      </Button>
    </div>
  );
}

export default CeloLoginTab;
