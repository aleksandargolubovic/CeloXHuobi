import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getWidgets, selectWidgets } from '../store/widgetsSlice';
import WidgetOrgBudget from '../widgets/WidgetOrgBudget';
import WidgetReqPieChart from '../widgets/WidgetReqPieChart';
import WidgetReqNum from '../widgets/WidgetReqNum';
import instance from "app/services/hedera/expenseService/expenseService";
import {
  getProvider,
  getSigner } from 'app/services/hedera/providers/hashconnectProvider';

function HomeTab() {
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);
  //const events = useEvents(organization.id, 1);
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  function handleAmountChange(event) {
    setAmount(event.target.value);
  }

  const sendFunds = async() => {
    const provider = getProvider();
    const signer = getSigner(provider);
    const ret = await instance.sendFunds(organization.id, amount, signer);
    console.log(ret);
    setAmount(0);
    dispatch(getWidgets(organization.id));
  }

  return (
    <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <WidgetReqNum widget={widgets.widget1} color="blue" />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <WidgetReqNum widget={widgets.widget2} color="green" />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <WidgetReqNum widget={widgets.widget3} color="red" />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <WidgetReqNum widget={widgets.widget4} color="orange" />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 p-12">
        <WidgetReqPieChart widget={widgets.widget7} />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 p-12">
        <WidgetOrgBudget widget={widgets.widget9} />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full p-12">
        <Paper className="w-full rounded-20 shadow">
          <div className="flex flex-col w-full p-20">
            <div className="flex items-center justify-between p-20 h-64">
              <Typography className="text-16 font-medium">Send Funds To This Organization</Typography>
            </div>
            <div className="flex items-center">
              <TextField
                className="mt-8 mb-16"
                label="Amount"
                id="amountToSend"
                value={amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">ℏ</InputAdornment>,
                }}
                type="number"
                variant="outlined"
                fullWidth
                onChange={handleAmountChange}
              />
            </div>
            <div className="flex flex-row items-center">
              <Button
                variant="contained"
                color="secondary"
                onClick={sendFunds}
              >
                Send
              </Button>
            </div>
            {/* <div className="flex items-center">
              <TextField
                className="mt-8 mb-16"
                label="Amount1"
                id="event"
                value={events}
                //type="string"
                variant="outlined"
                fullWidth
              />
            </div> */}
          </div>
        </Paper>
      </motion.div>
    </motion.div>
  );
}

export default HomeTab;
