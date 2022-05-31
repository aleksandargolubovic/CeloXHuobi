import { combineReducers } from '@reduxjs/toolkit';
import organization from './organizationSlice';

const reducer = combineReducers({
  organization,
});

export default reducer;
