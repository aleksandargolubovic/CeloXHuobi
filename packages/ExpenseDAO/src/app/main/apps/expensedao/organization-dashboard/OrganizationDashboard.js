import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import OrganizationDashboardHeader from './OrganizationDashboardHeader';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import HomeTab from './tabs/HomeTab';
import TeamMembersTab from './tabs/TeamMembersTab';
import NewOrganizationHeader from '../organization-setup/NewOrganizationHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    minHeight: 160,
    height: 160,
  },
}));

function OrganizationDashboard(props) {
  const dispatch = useDispatch();
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);
  const widgets = useSelector(selectWidgets);

  const pageLayout = useRef(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getWidgets(organization.id));
  }, [dispatch]);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  if (_.isEmpty(widgets)) {
    return null;
  }

  return (
    <Root
      header={<OrganizationDashboardHeader/>}
      contentToolbar={
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="w-full px-24 -mx-4 min-h-40"
          classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
          TabIndicatorProps={{
            children: (
              <Box
                sx={{ bgcolor: 'text.disabled' }}
                className="w-full h-full rounded-full opacity-20"
              />
            ),
          }}
        >
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Home"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Team Members"
          />
        </Tabs>
      }
      content={
        <div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
          {tabValue === 0 && <HomeTab />}
          {tabValue === 1 && <TeamMembersTab />}
        </div>
      }
      ref={pageLayout}
    />
  );
}

export default withReducer('organizationDashboard', reducer)(OrganizationDashboard);
