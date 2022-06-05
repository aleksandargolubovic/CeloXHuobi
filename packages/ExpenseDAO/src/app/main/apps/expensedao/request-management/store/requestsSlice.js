import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import Web3 from 'web3';

const APPROVED = "Approved";
const DENIED = "Denied";
const PROCESSING = "Pending";


const decodeCategory = (categoryNum) => {
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
                    async (params) => {

  let response;
  if (params.organization.isAdmin) {
    response = await params.organization.contract.methods.getRequests().call();
  } else {
    response = await params.organization.contract.methods.getMembersRequests()
      .call({from: params.address});
  }
  console.log(response);

  let data = response.map((req) => {

    const newElem =
    {
      id: req.id,
      creator: req.member,
      amount: (Web3.utils.fromWei(req.amount.toString(), 'ether')),
      date: (new Date(parseInt(req.date))).toLocaleDateString("en-US"),
      status: req.processed ? (req.approved ? APPROVED : DENIED) : PROCESSING,
      category: decodeCategory(req.category),
      receipt: req.url,
      description: req.description,
    };
    return newElem;
  });
  
  return data;
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
