import { combineReducers } from '@reduxjs/toolkit';
import widgets from './widgetsSlice';
import teamMembers from './teamMembersSlice'

const reducer = combineReducers({
  widgets,
  teamMembers
});

export default reducer;
