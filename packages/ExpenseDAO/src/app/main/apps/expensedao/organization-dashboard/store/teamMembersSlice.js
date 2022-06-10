import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

let currentId = 0;

function constructTeamMembersList(input, role) {
  const newList = input.map((elem) => {
    const newElem =
    {
      id: currentId,
      cells: [
        {
          id: 'avatar',
          value: elem
        },
        {
          id: 'address',
          value: elem
        },
        {
          id: 'role',
          value: role
        },
      ]
    }
    currentId += 1;
    return newElem;
  });
  return newList;
}

export const getTeamMembers =
  createAsyncThunk('organizationDashboard/teamMembers/getTeamMembers',
    async (params) => {
      let response = await params.contract.methods.getMembers().call();
      currentId = 0;
      const members = constructTeamMembersList(response, "Member");
      response = await params.contract.methods.getApprovers().call();
      const approvers = constructTeamMembersList(response, "Approver");
      const data = {
        teamMembers:
        {
          id: 'widget12',
          title: 'Team Members',
          table: {
            columns: [
              {
                id: 'avatar',
                title: ''
              },
              {
                id: 'address',
                title: 'Address'
              },
              {
                id: 'role',
                title: 'Role'
              }
            ],
            rows: [
            ]
          }
        }
      };

      const dataRows = approvers.concat(members);
      data.teamMembers.table.rows = dataRows;
      return data;
    });

const requestsAdapter = createEntityAdapter({});

export const { selectAll: selectTeamMembers, selectById: selectRequestById } = requestsAdapter.getSelectors(
  (state) => state.organizationDashboard.teamMembers
);

const requestsSlice = createSlice({
  name: 'organizationDashboard/teamMembers',
  initialState: requestsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getTeamMembers.fulfilled]: requestsAdapter.setAll,
  },
});

export default requestsSlice.reducer;
