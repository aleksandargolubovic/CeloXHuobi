import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
//import { AccountId, Hbar } from "@hashgraph/sdk";
//import instance from "app/services/hedera/expenseService/expenseService";

export const getWidgets =
  createAsyncThunk('organizationDashboard/widgets/getWidgets', 
                    async (organizationID) => {

  let defaultResponse = await axios.get('/api/expensedao/widgets');
  let data = await defaultResponse.data;
  console.log(data);                 

  // const response = await instance.getSummary(organizationID);
  // console.log(response);

  // const balance = await instance.getContractBalance(organizationID);

  // // Set total requests.
  // data[0].data.count = response.requestsNum;

  // // Set approved requests.
  // data[1].data.count = response.approvedNum;

  // // Set denied requests.
  // data[2].data.count = response.deniedNum;

  // // Set pending requests.
  // data[3].data.count =
  //   response.requestsNum - response.approvedNum - response.deniedNum;

  // // Set budget distribution. If there are no requests, use default pie chart.
  // if (response.requestsNum > 0) {
  //   console.log("there are requests");
  //   data[4].mainChart.series = [
  //     response.category1 / response.requestsNum,
  //     response.category2 / response.requestsNum,
  //     response.category3 / response.requestsNum,
  //     response.category4 / response.requestsNum,
  //     response.category5 / response.requestsNum,
  //     response.category6 / response.requestsNum];

  //   data[4].mainChart.options.labels = [
  //     'Equipment',
  //     'Home Office',
  //     'Meals and Entertainment',
  //     'Office Supplies',
  //     'Travel',
  //     'Other'];
  // }
  // console.log(data);
  // // Set 'spent' widget.
  // data[6].totalSpent.count = (parseFloat(Hbar.fromTinybars(response.paidTotal)).toFixed(4)).toString();
  // data[6].remaining.count = parseFloat(balance.toBigNumber()).toFixed(4);
  // const sum = parseFloat(data[6].totalSpent.count)
  //   + parseFloat(data[6].remaining.count);
  // data[6].totalBudget.count = sum.toFixed(4).toString();
  return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } =
  widgetsAdapter.getSelectors((state) => state.organizationDashboard.widgets);

const widgetsSlice = createSlice({
  name: 'organizationDashboard/widgets',
  initialState: widgetsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: widgetsAdapter.setAll,
  },
});

export default widgetsSlice.reducer;
