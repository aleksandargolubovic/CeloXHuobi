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
import Web3 from 'web3';
import { useCelo } from '@celo/react-celo';
import { StableToken } from '@celo/contractkit';

function HomeTab() {
  const [amount, setAmount] = useState('');
  const [mco2Amount, setmco2Amount] = useState('');
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);
  const { kit, address, performActions } = useCelo();

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

  function handlemco2AmountChange(event) {
    setmco2Amount(event.target.value);
  }

  const sendFunds = async() => {
    try {    
      await performActions(async (k) => {
        let stableTokenEnum;
        switch (organization.currency) {
          case 'cUSD':
            stableTokenEnum = StableToken.cUSD;
            break;
          case 'cEUR':
            stableTokenEnum = StableToken.cEUR;
            break;
          default:
            stableTokenEnum = StableToken.cUSD;
            break;
        }
        const stableToken = await k.contracts.getStableToken(stableTokenEnum);
        const result = await stableToken
          .transfer(
            // impact market contract
            organization.contract.options.address,
            Web3.utils.toWei(amount, 'ether')
          )
          .sendAndWaitForReceipt({
            from: address,
            gasPrice: k.connection.defaultGasPrice,
          });
        
        console.log(result);
      });
    } catch (e) {
      console.log(e);
    }

    setAmount(0);
    dispatch(getWidgets({
      contract: organization.contract,
      kit: kit,
      currency: organization.currency }));
  }

  const sendmco2Funds = async() => {
    try {    
      await performActions(async (k) => {
        let stableTokenEnum;
        switch (organization.currency) {
          case 'cUSD':
            stableTokenEnum = StableToken.cUSD;
            break;
          case 'cEUR':
            stableTokenEnum = StableToken.cEUR;
            break;
          default:
            stableTokenEnum = StableToken.cUSD;
            break;
        }
        const stableToken = await k.contracts.getStableToken(stableTokenEnum);
        const result = await stableToken
          .transfer(
            // impact market contract
            organization.contract.options.address,
            Web3.utils.toWei(amount, 'ether')
          )
          .sendAndWaitForReceipt({
            from: address,
            gasPrice: k.connection.defaultGasPrice,
          });
        
        console.log(result);
      });
    } catch (e) {
      console.log(e);
    }

    setAmount(0);
    dispatch(getWidgets({
      contract: organization.contract,
      kit: kit,
      currency: organization.currency }));
  }

  const compensateCO2 = async() => {
    try {
      await performActions(async (kit) => {
        const gasLimit = await organization.contract.methods
          .compensateCO2()
          .estimateGas();

        const result = await organization.contract.methods
          .compensateCO2()
          .send({ from: address, gasLimit });

        console.log(result);
      });
    } catch (e) {
      console.log(e);
    }

    dispatch(getWidgets({
      contract: organization.contract,
      kit: kit,
      currency: organization.currency }));
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
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <WidgetOrgBudget widget={widgets.widget9} currency={organization.currency} />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <WidgetOrgBudget widget={widgets.widget10} currency="MC02" />
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
                  startAdornment: <InputAdornment position="start">{organization.currency}</InputAdornment>,
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
          </div>
        </Paper>
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 p-12">
        <Paper className="w-full rounded-20 shadow">
          <div className="flex flex-col w-full p-20">
            <div className="flex items-center justify-between p-20 h-64">
              <Typography className="text-16 font-medium">Compensate your organization carbon emissions</Typography>
            </div>
            <div className="flex items-center">
              <TextField
                className="mt-8 mb-16"
                label="Pending MCO2 amount"
                id="mco2AmountToOffset"
                value={widgets.widget10.remaining.count}
                // InputProps={{
                //   startAdornment: <InputAdornment position="start">{organization.currency}</InputAdornment>,
                // }}
                // type="number"
                variant="outlined"
                fullWidth
                //onChange={handleAmountChange}
              />
            </div>
            <div className="flex flex-row items-center">
              <Button
                variant="contained"
                color="secondary"
                onClick={compensateCO2}
              >
                Offset Now
              </Button>
            </div>
          </div>
        </Paper>
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/2 p-12">
        <Paper className="w-full rounded-20 shadow">
          <div className="flex flex-col w-full p-20">
            <div className="flex items-center justify-between p-20 h-64">
              <Typography className="text-16 font-medium">Fund your organization with carbon credits</Typography>
            </div>
            <div className="flex items-center">
              <TextField
                className="mt-8 mb-16"
                label="MCO2 amount"
                id="mco2Amount"
                value={mco2Amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">MCO2</InputAdornment>,
                }}
                type="number"
                variant="outlined"
                fullWidth
                onChange={handlemco2AmountChange}
              />
            </div>
            <div className="flex flex-row items-center">
              <Button
                variant="contained"
                color="secondary"
                onClick={sendmco2Funds}
              >
                Send MCO2
              </Button>
            </div>
          </div>
        </Paper>
      </motion.div>
    </motion.div>
  );
}

export default HomeTab;
