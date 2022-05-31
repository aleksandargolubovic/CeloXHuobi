import { combineReducers } from '@reduxjs/toolkit';
import request from './requestSlice';
import requests from './requestsSlice';

const reducer = combineReducers({
  requests,
  request,
});

export default reducer;
