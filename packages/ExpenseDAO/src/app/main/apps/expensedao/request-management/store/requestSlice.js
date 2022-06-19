import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Web3 from 'web3';

const APPROVED = "Approved";
const DENIED = "Denied";
const PROCESSING = "Pending";

const decodeCategory = (categoryNum) => {
  // console.log(categoryNum);
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
  // console.log(params);
  const response = await params.organization.contract.methods
    .getRequest(params.routeParams.requestId).call();
  // console.log(response);

  const req = response;
  const data =
  {
    id: req.id,
    creator: req.member,
    amount: (Web3.utils.fromWei(req.amount.toString(), 'ether')),
    co2: (Web3.utils.fromWei(req.co2.toString(), 'ether')),
    date: (new Date(parseInt(req.date))).toLocaleDateString("en-US"),
    status: req.processed ? (req.approved ? APPROVED : DENIED) : PROCESSING,
    category: decodeCategory(req.category),
    receipt: req.url,
    description: req.description,
  };

  return data === undefined ? null : data;
});

export const saveRequest = createAsyncThunk('expensedao/request/saveRequest', async (request) => {
  const response = await axios.post('/api/e-commerce-app/request/save', request);
  const data = await response.data;

  return data;
});

export const processRequest = createAsyncThunk(
  'expensedao/request/processRequest',
  async (params, { dispatch, getState }) => {
    let request = getState().expensedao.request;
    const newState = { ...request, status: params.newStatus == true ? APPROVED : DENIED}
    return newState;
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
    [processRequest.fulfilled]: (state, action) => action.payload,
    // [denyRequest.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetRequest } = requestSlice.actions;

export default requestSlice.reducer;
