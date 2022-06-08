import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { newOrganization, getOrganization } from '../store/organizationSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Link, useNavigate } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import _ from '@lodash';
import { useCelo } from '@celo/react-celo';
import { StableToken } from '@celo/contractkit';
import registry from "app/contracts/Registry.json";
import expenseDAO from "app/contracts/ExpenseDAO.json";
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
});

const NULL_ADDR = '0x0000000000000000000000000000000000000000';

function EnterOrganizationDialog(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { watch, handleSubmit, formState, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  const { kit, address, network, performActions } = useCelo();
  
  const contract = new kit.connection.web3.eth.Contract(
    registry.abi,
    registry.address
  );

  const { isValid, dirtyFields, errors } = formState;

  function handleOpenDialog() {
    props.setOpenDialog(true);
  }

  function handleCloseDialog() {
    props.setOpenDialog(false);
  }

  function handleDelete() {
    props.setOpenDialog(false);
  }

  async function onSubmit(data) {
    // console.info(data);
    dispatch(newOrganization());

    let response = await contract.methods.organizations(data.name).call();
    // console.log(response);
    
    if (response === NULL_ADDR) {
      dispatch(showMessage({ message: "Organization doesn't exist" }));
    } else {
      const daoContract = new kit.connection.web3.eth.Contract(
        expenseDAO.abi,
        response
      );
      
      const isMember = await daoContract.methods.isMember().call();
      if (isMember === false) {
        const isApprover = await daoContract.methods.isApprover().call();
        if (isApprover === false) {
          dispatch(showMessage({ message: "You are not part of this organization!" }));
          return;
        }
      }

      const stableCoinAddress = await daoContract.methods.stableCoinAddress().call();
      const cEURAddress = await kit.celoTokens.getAddress(StableToken.cEUR);
      let currency = 'cUSD';
      if (stableCoinAddress === cEURAddress) {
        currency = 'cEUR';
      }
      dispatch(getOrganization({
        address: response,
        name: data.name,
        contract: daoContract,
        currency: currency})).then((action) => {

        props.setOpenDialog(false);
        navigate('/apps/expensedao/organization');
      });
    }
  }

  return (
    <div className="p-24 pb-8">
      <Dialog
        open={props.openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
        scroll="body"
      >
        <AppBar position="static" elevation={0}>
          <Toolbar className="flex w-full">
            <Typography variant="subtitle1" color="inherit">
              Enter Existing Organization
            </Typography>
          </Toolbar>
        </AppBar>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
            
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  label="Name"
                  autoFocus
                  id="name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />

          </DialogContent>

          <DialogActions className="justify-between px-8 py-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Enter
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default withReducer('expensedaoorg', reducer)(EnterOrganizationDialog);
