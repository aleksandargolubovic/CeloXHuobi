import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { useSnackbar } from 'notistack';
import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import NotificationModel from './model/NotificationModel';
import NotificationCard from './NotificationCard';
import NotificationTemplate from './NotificationTemplate';
import {
  getNotifications,
  addNotification,
  dismissAll,
  dismissItem,
  selectNotifications,
} from './store/dataSlice';
import reducer from './store';
import { closeNotificationPanel, toggleNotificationPanel } from './store/stateSlice';
import { useEvents } from 'app/services/hooks';
import { getWidgets } from 'app/main/apps/expensedao/organization-dashboard//store/widgetsSlice';
import { useCelo } from '@celo/react-celo';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: 320,
  },
}));

let displayed = [];

const storeDisplayed = (id) => {
  displayed = [...displayed, id];
};

const removeDisplayed = (id) => {
  displayed = [...displayed.filter((key) => id !== key)];
};

function NotificationPanel(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg?.organization);
  const { kit, address, network, performActions } = useCelo();
  const state = useSelector(({ notificationPanel }) => notificationPanel.state);
  const notifications = useSelector(selectNotifications);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    console.log("NOTIFICATION refresh");
    if (organization && organization.contract) {
      const response = kit.connection.web3.eth.clearSubscriptions();
      console.log(response);
      console.log("subscribed");
      organization.contract.events.allEvents({
      //   filter: {
      //     value: [],
      // },
      fromBlock: 'latest'
      }, function(error, event){ })
      .on('data', function(event){
          console.log("data");
          console.log(event);
          if (event.event === undefined) {
          organization.contract.getPastEvents("allEvents", {
            fromBlock: event.blockNumber,
            toBlock: 'latest'}, function(error, events){
              console.log(events);
              createNotification({
                message: "NEW EVENT",
                options: { variant: 'success' },
              });
            });
          } else {
            createNotification({
              message: "NEW EVENT",
              options: { variant: 'success' },
            });
          }

      })
      .on('changed', function(event){
          // remove event from local database
      })
      .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(error);
      })
      .on("connected", function(subscriptionId){
        console.log("connected");
        console.log(subscriptionId);
      });
    }
  }, [organization]);

  /*
    Add Notifications for demonstration
  */
  function createNotification(obj) {
    dispatch(addNotification(NotificationModel(obj)));
  };

  useEffect(() => {
    notifications.forEach((item) => {
      const { id: key, message, options = {}, dismissed = false } = item;

      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(key);
        return;
      }
      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) {
        return;
      }

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        ...options,
        // autoHideDuration: 3000,
        content: () => (
          <NotificationTemplate
            item={item}
            onClose={() => {
              closeSnackbar(key);
              dispatch(dismissItem(key));
            }}
          />
        ),
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (event, myKey) => {},
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  useEffect(() => {
    if (state) {
      dispatch(closeNotificationPanel());
    }
    // eslint-disable-next-line
	}, [location, dispatch]);

  function handleClose() {
    dispatch(closeNotificationPanel());
  }

  function handleDismiss(id) {
    dispatch(dismissItem(id));
  }
  function handleDismissAll() {
    dispatch(dismissAll());
  }

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => {}}
      onClose={(ev) => dispatch(toggleNotificationPanel())}
      disableSwipeToOpen
    >
      <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={handleClose} size="large">
        <Icon color="action">close</Icon>
      </IconButton>
      {notifications.length > 0 ? (
        <FuseScrollbars className="p-16">
          <div className="flex flex-col">
            <div className="flex justify-between items-end pt-136 mb-36">
              <Typography className="text-28 font-semibold leading-none">Notifications</Typography>
              <Typography
                className="text-12 underline cursor-pointer"
                color="secondary"
                onClick={handleDismissAll}
              >
                dismiss all
              </Typography>
            </div>
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                className="mb-16"
                item={item}
                onClose={handleDismiss}
              />
            ))}
          </div>
        </FuseScrollbars>
      ) : (
        <div className="flex flex-1 items-center justify-center p-16">
          <Typography className="text-24 text-center" color="textSecondary">
            There are no notifications for now.
          </Typography>
        </div>
      )}
    </StyledSwipeableDrawer>
  );
}

export default withReducer('notificationPanel', reducer)(memo(NotificationPanel));
