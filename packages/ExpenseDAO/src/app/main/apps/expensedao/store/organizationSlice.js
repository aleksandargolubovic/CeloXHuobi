import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { useCelo } from '@celo/react-celo';
import registry from "app/contracts/Registry.json";

export const getOrganization =
  createAsyncThunk('expensedao/organization/getProduct',
  async (params, {getState}) => {

  const isAdmin = await params.contract.methods.isApprover().call();
  console.log("IS ADMIN", isAdmin);
  const organization = {
    id: params.address,
    name: params.name,
    isAdmin: isAdmin,
    contract: params.contract,
  };
  console.log("NEW STATE", organization);
  return organization;
});

export const removeOrganization = createAsyncThunk(
  'expensedao/organization/removeProduct',
  async (val, { dispatch, getState }) => {
    const { id } = getState().eCommerceApp.product;
    await axios.post('/api/e-commerce-app/remove-product', { id });

    return id;
  }
);

export const saveOrganization = createAsyncThunk(
  'expensedao/organization/saveProduct',
  async (productData, { dispatch, getState }) => {
    // const provider = getProvider();
    // const signer = getSigner(provider);
    // //console.log("SIGNER", signer);
    // const response = await instance.createNewOrganization(
    //   productData.name,
    //   productData.approvers,
    //   productData.members,
    //   signer);

    // console.log(response);
    //return response;
  }
);

const contactsAdapter = createEntityAdapter({});

const organizationSlice = createSlice({
  name: 'expensedaoorg/organization',
  initialState: contactsAdapter.getInitialState({
    routeParams: {},
    contactDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    resetOrganization: () => null,
    newOrganization: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '0.0.0',
          name: '',
          approvers: [],
          members: [],
          images: [],
          active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getOrganization.fulfilled]: (state, action) => action.payload,
    //[saveOrganization.fulfilled]: (state, action) => action.payload,
    [removeOrganization.fulfilled]: (state, action) => null,
  },
});

export const { newOrganization, resetOrganization } = organizationSlice.actions;

export default organizationSlice.reducer;
