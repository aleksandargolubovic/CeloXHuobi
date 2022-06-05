import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Blockies from "react-blockies";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';
import { useCelo } from '@celo/react-celo';
import { useBalance } from 'app/services/hooks';
import Web3 from 'web3';

const CELO = 0;
const cUSD = 1;
const cEUR = 2;
const cREAL = 3;
const currencies = ['CELO', 'cUSD', 'cEUR', 'cREAL'];

const nextCurrency = (current) => {
  if (current == cREAL) {
    return CELO;
  }
  return current + 1;
}

function UserMenu(props) {
  const { destroy, network, kit, address } = useCelo();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const navigate = useNavigate();
  const balance = useBalance(kit, address, 5);
  const [selectedBalance, setSelectedBalance] = useState(CELO);
  //const [priceInUSD, setPriceInUSD] = useState(false);
  //const price = "11";//useExchangeHbarPrice(2);

  const [userMenu, setUserMenu] = useState(null);

  const balanceToShow = (selected) => {
    switch (selected) {
      case CELO:
        return balance.CELO;
      case cUSD:
        return balance.cUSD;
      case cEUR:
        return balance.cEUR;
      case cREAL:
        return balance.cREAL;
    }
  };

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const displayAddress = user.data.displayName?.substr(0, 5) + "..." + user.data.displayName?.substr(-4);

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={() => {
          setSelectedBalance(nextCurrency(selectedBalance));
        }}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
              {parseFloat(Web3.utils.fromWei(balanceToShow(selectedBalance).toString(), 'ether')).toFixed(4) + " " + currencies[selectedBalance]}
          </Typography>
        </div>
      </Button>
      
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {displayAddress}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="textSecondary">
            {network.name}
          </Typography>
        </div>
        <Avatar className="md:mx-4"><Blockies size={18} seed={user.data.displayName.toLowerCase()} /></Avatar>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/login" role="button">
              <ListItemIcon className="min-w-40">
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MenuItem>
            <MenuItem component={Link} to="/register" role="button">
              <ListItemIcon className="min-w-40">
                <Icon>person_add</Icon>
              </ListItemIcon>
              <ListItemText primary="Register" />
            </MenuItem>
          </>
        ) : (
          <>
            {/* <MenuItem component={Link} to="/pages/profile" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem component={Link} to="/apps/mail" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <Icon>mail</Icon>
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </MenuItem> */}
            <MenuItem
              onClick={async () => {
                await destroy();
                dispatch(logoutUser());
                //userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText primary="Disconnect wallet" />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
