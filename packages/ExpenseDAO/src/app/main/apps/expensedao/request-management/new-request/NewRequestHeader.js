import { useState } from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';
import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';

import _ from '@lodash';
import { useCelo } from '@celo/react-celo';
import Web3 from 'web3';
import { addToIPFS, retrieveFile } from "./helpers/web3Storage";

function NewRequestHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);
  const { kit, address, network, performActions } = useCelo();
  const { formState, watch, getValues, setValue } = methods;
  const { isValid, dirtyFields } = formState;
  const featuredImageId = watch('featuredImageId');
  const image = watch('image');
  const category = watch('category');
  const description = watch('description');
  const amount = watch('amount');
  const theme = useTheme();
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);

  function encodeCategory(category) {
    let categoryInt = 0;
    switch (category) {
      case 'Equipment':
        categoryInt = 1;
        break;
      case 'Home Office':
        categoryInt = 2;
        break;
      case 'Meals and Entertainment':
        categoryInt = 3;
        break;
      case 'Office Supplies':
        categoryInt = 4;
        break;
      case 'Travel':
        categoryInt = 5;
        break;
      case 'Other':
        categoryInt = 6;
        break;
      default:
        categoryInt = 0;
    }
    return categoryInt;
  }

  function calculateCarbonFootprint()
  {
    console.log(getValues());
    const parameters = getValues();
    console.log(parameters.CO_distance);
    if (!parameters.CO_distance) {
      return 0;
    }
    let co2PerKm = 0;
    switch (parameters.CO_vehicle) {
      case 'Bus':
        co2PerKm = 0.000089;
        break;
      case 'Airplane':
        co2PerKm = 0.000180;
        break;
      case 'Car':
        co2PerKm = 0.000120;
        break;
      default:
        co2PerKm = 0;
    }
    let result = co2PerKm * parameters.CO_distance;
    if (parameters.CO_distance_unit === "mi") result *= 1.6;
    console.log(result);
    return result;
  }

  function handleSendRequest() {
    console.log(getValues());
    setButtonLoading(true);

    const co2Amount = calculateCarbonFootprint();
    console.log("CO2", co2Amount.toFixed(18));
    console.log("CO2 wei", Web3.utils.toWei(co2Amount.toFixed(6), 'ether'));

    const files = [ image.file ];
    addToIPFS(files).then(async (result) => {
      console.log(result);

      let url = await retrieveFile(result);
      console.log(url);
      let date = (new Date()).getTime();
      setValue("date", date);
      image.ipfsUrl = url;
      console.log(getValues());

      try {
        const parameters = getValues();
        await performActions(async (kit) => {
          const gasLimit = await organization.contract.methods
            .createRequest(
              parameters.description,
              parameters.image.ipfsUrl,
              address,
              Web3.utils.toWei(parameters.amount, 'ether'),
              parameters.date,
              Web3.utils.toWei(co2Amount.toFixed(18), 'ether'),
              encodeCategory(parameters.category))
            .estimateGas();
  
          const result = await organization.contract.methods
            .createRequest(
              parameters.description,
              parameters.image.ipfsUrl,
              address,
              Web3.utils.toWei(parameters.amount, 'ether'),
              parameters.date,
              Web3.utils.toWei(co2Amount.toFixed(18), 'ether'),
              encodeCategory(parameters.category))
            .send({ from: address, gasLimit });
  
          console.log(result);
          setButtonLoading(false);
          dispatch(addNotification(NotificationModel({
            message: "New request created!",
            options: { variant: 'success' },
          })));
  
          const variant = result.status == true ? "success" : "error";
          const url = `${network.explorer}/tx/${result.transactionHash}`;
          
          navigate('/apps/expensedao/requests');
        });
      } catch (e) {
        console.log(e);
        setButtonLoading(false);
      }

    }, function (err) {
      console.log(err);
      setButtonLoading(false);
    });
  }

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex flex-col items-start max-w-full min-w-0">
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
            <span className="hidden sm:flex mx-4 font-medium">Requests</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
            <motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                New Request
              </Typography>
              <Typography variant="caption" className="font-medium">
                Request Detail
              </Typography>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={image == '' || category == '' || amount == ''}
          onClick={handleSendRequest}
          loading={buttonLoading}
        >
          Send New Request
        </LoadingButton>
      </motion.div>
    </div>
  );
}

export default NewRequestHeader;
