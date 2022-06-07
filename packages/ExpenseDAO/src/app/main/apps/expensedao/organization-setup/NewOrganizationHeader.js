import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import { newOrganization, getOrganization } from '../store/organizationSlice';
import { StableToken } from '@celo/contractkit';
import { useCelo } from '@celo/react-celo';
import expenseDAOFactory from "app/contracts/ExpenseDAOFactory.json";
import registry from "app/contracts/Registry.json";
import expenseDAO from "app/contracts/ExpenseDAO.json";

const NULL_ADDR = '0x0000000000000000000000000000000000000000';

function NewOrganizationHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const featuredImageId = watch('featuredImageId');
  const images = watch('images');
  const name = watch('name');
  const theme = useTheme();
  const navigate = useNavigate();
  const { kit, address, network, performActions } = useCelo();

  const createNewOrganization = async() => {
    try {
      const contract = new kit.connection.web3.eth.Contract(
        expenseDAOFactory.abi,
        expenseDAOFactory.address
      );

      const parameters = getValues();

      let stableTokenAddress = NULL_ADDR;
      switch (parameters.currency) {
        case 'cUSD':
          stableTokenAddress = await kit.celoTokens.getAddress(StableToken.cUSD);
          break;
        case 'cEUR':
          stableTokenAddress = await kit.celoTokens.getAddress(StableToken.cEUR);
          break;
        default:
          break;
      }
      await performActions(async (kit) => {
        const gasLimit = await contract.methods.newExpenseOrg(
            parameters.name, stableTokenAddress, parameters.approvers,
            parameters.members)
          .estimateGas();

        const result = await contract.methods.newExpenseOrg(
          parameters.name, stableTokenAddress, parameters.approvers,
          parameters.members)
          .send({ from: address, gasLimit });

        console.log(result);

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;

        dispatch(newOrganization());

        const registryContract = new kit.connection.web3.eth.Contract(
          registry.abi,
          registry.address
        );
        let response = await registryContract.methods.organizations(parameters.name).call();
        console.log(response);
        
        if (response === NULL_ADDR) {
          dispatch(showMessage({ message: "Organization doesn't exist" }));
        } else {
          const daoContract = new kit.connection.web3.eth.Contract(
            expenseDAO.abi,
            response
          );
          console.log("DAO CONTRACT", daoContract);

          dispatch(getOrganization({
            address: response,
            name: parameters.name,
            contract: daoContract,
            currency: parameters.currency,
          })).then((action) => {
            navigate('/apps/expensedao/organization');
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  function handleSaveOrganization() {
    createNewOrganization();
    //dispatch(saveOrganization(getValues()));
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
            to="/apps/expensedao/organizations/choose"
            color="inherit"
          >
            <Icon className="text-20">
              {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
            </Icon>
            <span className="hidden sm:flex mx-4 font-medium">Back</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
            <motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                New Organization
              </Typography>
              <Typography variant="caption" className="font-medium">
                Organization Detail
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
        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSaveOrganization}
        >
          Create New Organization
        </Button>
      </motion.div>
    </div>
  );
}

export default NewOrganizationHeader;
