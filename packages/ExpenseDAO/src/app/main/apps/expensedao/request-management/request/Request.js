import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme, styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import reducer from '../store';
import { resetRequest, getRequest, approveRequest, denyRequest } from '../store/requestSlice';
import RequestDetailsTab from './tabs/RequestDetailsTab';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 136,
      height: 136,
    },
  },
}));

function Request(props) {
  const dispatch = useDispatch();
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);
  const request = useSelector(({ expensedao }) => expensedao.request);
  const theme = useTheme();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noRequest, setNoRequest] = useState(false);

  useDeepCompareEffect(() => {
    dispatch(getRequest(routeParams)).then((action) => {
      if (!action.payload) {
        setNoRequest(true);
      }
    });
  }, [dispatch, routeParams]);

  useEffect(() => {
    console.log("newState", request);
    return () => {
      dispatch(resetRequest());
      setNoRequest(false);
    };
  }, [dispatch]);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  function handleApproveRequest() {
    dispatch(approveRequest(routeParams));
  }

  function handleDenyRequest() {
    dispatch(denyRequest(routeParams));
  }

  if (noRequest) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such request!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/expensedao/requests"
          color="inherit"
        >
          Go to Requests Page
        </Button>
      </motion.div>
    );
  }

  return (
    <Root
      header={
        request && (
          <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex flex-1 flex-col items-center sm:items-start">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
              >
                <Typography
                  className="flex items-center sm:mb-12"
                  component={Link}
                  role="button"
                  to="/apps/expensedao/requests"
                  color="inherit"
                >
                  <Icon className="text-20">
                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                  </Icon>
                  <span className="mx-4 font-medium">Requests</span>
                </Typography>
              </motion.div>

              <div className="flex flex-col min-w-0 items-center sm:items-start">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
                >
                  <Typography className="text-16 sm:text-20 truncate font-semibold">
                    {`Request ${request.id}`}
                  </Typography>
                </motion.div>
              </div>
            </div>
            {organization.isAdmin && request.status == 'Pending' &&
              <motion.div
                className="flex"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              >
                <Button
                  className="whitespace-nowrap mx-4"
                  variant="contained"
                  color="secondary"
                  onClick={handleApproveRequest}
                >
                  Approve
                </Button>
                <Button
                  className="whitespace-nowrap mx-4"
                  variant="contained"
                  color="secondary"
                  onClick={handleDenyRequest}
                >
                  Deny
                </Button>
              </motion.div>
            }
          </div>
        )
      }
      contentToolbar={
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: 'w-full h-64' }}
        >
          <Tab className="h-64" label="Request Details" />
        </Tabs>
      }
      content={
        request && (
          <div className="p-16 sm:p-24 max-w-2xl w-full">
            {tabValue === 0 && <RequestDetailsTab />}
          </div>
        )
      }
      innerScroll
    />
  );
}

export default withReducer('expensedao', reducer)(Request);
