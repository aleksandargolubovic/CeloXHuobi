import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

import instance from "app/services/hedera/expenseService/expenseService";
import {
  getProvider,
  getSigner
} from 'app/services/hedera/providers/hashconnectProvider';


export const sendRequest = createAsyncThunk(
  'expensedao/newRequest/sendRequest',
  async (requestData, { dispatch, getState }) => {
    const provider = getProvider();
    const signer = getSigner(provider);
    console.log("SIGNER", signer);
    let amount = parseFloat(parseFloat(requestData.amount) / parseFloat("0.101"));
    amount = parseInt(amount);
    const response = await instance.createRequest(
      requestData.organizationId,
      requestData.description,
      requestData.image.ipfsUrl,
      signer.accountToSign,//requestData.address,
      amount,
      requestData.date,
      requestData.category,
      signer
    );

    console.log(response);
    return response;
  }
);

const contactsAdapter = createEntityAdapter({});

const newRequestSlice = createSlice({
  name: 'expensedao/newRequest',
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
    resetRequest: () => null,
    newRequest: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          description: '',
          url: '',
          address: '',
          amount: '',
          date: '',
          category: '',
          active: true,
        },
      }),
    },
  },
});

export const { newRequest, resetRequest } = newRequestSlice.actions;

export default newRequestSlice.reducer;
