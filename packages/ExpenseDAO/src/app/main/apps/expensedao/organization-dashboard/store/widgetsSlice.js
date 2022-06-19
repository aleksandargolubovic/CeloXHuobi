import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Web3 from 'web3';
import co2Credit from "app/contracts/CO2Credit.json";

export const getWidgets =
  createAsyncThunk('organizationDashboard/widgets/getWidgets', 
                    async (params) => {

  let defaultResponse = await axios.get('/api/expensedao/widgets');
  let data = await defaultResponse.data;

  const response = await params.contract.methods.getSummary().call();
  
  const co2Contract = new params.kit.connection.web3.eth.Contract(
    co2Credit.abi,
    co2Credit.address
  );

  const mco2Balance =
    await co2Contract.methods.balanceOf(params.contract._address).call();

  const totalBalance = await params.kit.getTotalBalance(params.contract._address);
  const balanceInCurrency =
    params.currency === 'cEUR' ? totalBalance.cEUR : totalBalance.cUSD;

  // Set total requests.
  data[0].data.count = response.requestsNum;

  // Set approved requests.
  data[1].data.count = response.approvedNum;

  // Set denied requests.
  data[2].data.count = response.deniedNum;

  // Set pending requests.
  data[3].data.count =
    response.requestsNum - response.approvedNum - response.deniedNum;

  // Set request distribution. If there are no requests, use default pie chart.
  if (response.requestsNum > 0) {
    data[4].mainChart.series = [
      response.category1 / response.requestsNum,
      response.category2 / response.requestsNum,
      response.category3 / response.requestsNum,
      response.category4 / response.requestsNum,
      response.category5 / response.requestsNum,
      response.category6 / response.requestsNum];

    data[4].mainChart.options.labels = [
      'Equipment',
      'Home Office',
      'Meals and Entertainment',
      'Office Supplies',
      'Travel',
      'Other'];
  }

  // Set 'funds' widget.
  data[6].totalSpent.count = (parseFloat(Web3.utils.fromWei(response.paidTotal.toString(), 'ether')).toFixed(4));
  data[6].remaining.count = parseFloat(Web3.utils.fromWei(balanceInCurrency.toString(), 'ether')).toFixed(4);
  const sum = parseFloat(data[6].totalSpent.count)
    + parseFloat(data[6].remaining.count);
  data[6].totalBudget.count = sum.toFixed(4);

  // Set MCO2 token status widget.
  data[7].totalSpent.count =
    (parseFloat(Web3.utils.fromWei(response.CO2Total.toString(), 'ether')).toFixed(4));
  data[7].remaining.count =
    parseFloat(Web3.utils.fromWei(response.CO2Pending.toString(), 'ether')).toFixed(4);

  data[7].totalBudget.count =
    parseFloat(Web3.utils.fromWei(mco2Balance.toString(), 'ether')).toFixed(4);

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
