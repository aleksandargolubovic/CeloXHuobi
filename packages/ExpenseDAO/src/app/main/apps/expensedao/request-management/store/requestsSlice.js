import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
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

export const getRequests =
  createAsyncThunk('expensedao/requests/getRequests',
                    async (organizationID, isAdmin) => {

  // let response;
  // if (isAdmin) {
  //   response = await instance.getRequests(organizationID);
  // } else {
  //   const provider = getProvider();
  //   const signer = getSigner(provider);
  //   response = await instance.getMembersRequests(organizationID, signer);
  // }
  // console.log(response);

  // let data = response.requests.map((req) => {

  //   const newElem =
  //   {
  //     id: req.id,
  //     creator: (AccountId.fromSolidityAddress(req.member)).toString(),
  //     amount: Hbar.fromTinybars(req.amount).toString(),
  //     date: (new Date(parseInt(req.date))).toLocaleDateString("en-US"),
  //     status: req.processed ? (req.approved ? APPROVED : DENIED) : PROCESSING,
  //     category: decodeCategory(req.category),
  //     receipt: req.url,
  //     description: req.description,
  //   };
  //   return newElem;
  // });
  
  // return data;
});

export const removeRequests = createAsyncThunk(
  'expensedao/requests/removeRequests',
  async (requestIds, { dispatch, getState }) => {
    await axios.post('/api/e-commerce-app/remove-orders', { requestIds });

    return requestIds;
  }
);

const requestsAdapter = createEntityAdapter({});

export const { selectAll: selectRequests, selectById: selectRequestById } = requestsAdapter.getSelectors(
  (state) => state.expensedao.requests
);

const requestsSlice = createSlice({
  name: 'expensedao/requests',
  initialState: requestsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setRequestsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getRequests.fulfilled]: requestsAdapter.setAll,
    [removeRequests.fulfilled]: (state, action) => requestsAdapter.removeMany(state, action.payload),
  },
});

export const { setRequestsSearchText } = requestsSlice.actions;

export default requestsSlice.reducer;
