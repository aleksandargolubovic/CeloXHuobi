import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import instance from "app/services/hedera/expenseService/expenseService";
// import {
//   getProvider,
//   getSigner } from 'app/services/hedera/providers/hashconnectProvider';
// import { AccountId, Hbar } from "@hashgraph/sdk";

const APPROVED = "Approved";
const DENIED = "Denied";
const PROCESSING = "Pending";

const decodeCategory = (categoryNum) => {
  console.log(categoryNum);
  switch (categoryNum) {
    case '1':
      return 'Equipment';
    case '2':
      return 'Home Office';
    case '3':
      return 'Meals and Entertainment';
    case '4':
      return 'Office Supplies';
    case '5':
      return 'Travel';
    case '6':
      return 'Other';
    default:
      return "Unknown";
  }
}

export const getRequest = createAsyncThunk('expensedao/request/getRequest', async (params) => {
  console.log(params);
  // const response = await axios.get('/api/expensedao/request', { params });
  // const data = await response.data;

  // console.log("123123213");
  // console.log(data);

  // const response = await instance.getRequest(params.organizationId, params.requestId);
  // console.log(response);
  // const req = response[0];
  // const data =
  // {
  //   id: req.id,
  //   creator: (AccountId.fromSolidityAddress(req.member)).toString(),
  //   amount: Hbar.fromTinybars(req.amount).toString(),
  //   date: (new Date(parseInt(req.date))).toLocaleDateString("en-US"),
  //   status: req.processed ? (req.approved ? APPROVED : DENIED) : PROCESSING,
  //   category: decodeCategory(req.category),
  //   receipt: req.url,
  //   description: req.description,
  // };

  // return data === undefined ? null : data;
});

export const saveRequest = createAsyncThunk('expensedao/request/saveRequest', async (request) => {
  const response = await axios.post('/api/e-commerce-app/request/save', request);
  const data = await response.data;

  return data;
});

export const approveRequest = createAsyncThunk(
  'expensedao/request/approveRequest',
  async (params, { dispatch, getState }) => {

    //await axios.post('/expensedao/approve-request', { requestId });
    //return requestId;
  
    // const provider = getProvider();
    // const signer = getSigner(provider);
    
    // const approved = await instance.processRequest(
    //   params.organizationId, params.requestId, true, signer);

    // console.log("approved: ", approved);

    // let request = getState().expensedao.request;
    // // request.status = APPROVED;
    // // return request;
    // //return params.requestId;
    // const newState = { ...request, status: APPROVED }
    // return newState;
  }
);

export const denyRequest = createAsyncThunk(
  'expensedao/request/denyRequest',
  async (params, { dispatch, getState }) => {  
    // const provider = getProvider();
    // const signer = getSigner(provider);

    // const denied = await instance.processRequest(
    //   params.organizationId, params.requestId, false, signer);

    // console.log("denied: ", denied);
    // let request = getState().expensedao.request;
    // // request.status = DENIED;
    // // return request;
    // const newState = { ...request, status: DENIED }
    // return newState;
  }
);

const requestSlice = createSlice({
  name: 'expensedao/request',
  initialState: null,
  receiptDialog: {
    type: 'new',
    props: {
      open: false,
    },
    data: null,
  },
  reducers: {
    resetRequest: () => null,
  },
  extraReducers: {
    [getRequest.fulfilled]: (state, action) => action.payload,
    [saveRequest.fulfilled]: (state, action) => action.payload,
    [approveRequest.fulfilled]: (state, action) => action.payload,
    [denyRequest.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetRequest } = requestSlice.actions;

export default requestSlice.reducer;