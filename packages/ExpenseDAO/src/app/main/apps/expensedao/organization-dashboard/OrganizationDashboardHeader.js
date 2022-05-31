import Avatar from '@mui/material/Avatar';
import { lighten } from '@mui/material/styles';
import Hidden from '@mui/material/Hidden';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import { Box } from '@mui/system';
import { selectWidgets } from './store/widgetsSlice';

function OrganizationDashboardHeader(props) {
  const { pageLayout } = props;

  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);
  const user = useSelector(({ auth }) => auth.user);
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);

  return (
    <div className="flex justify-between flex-1 min-w-0 px-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center min-w-0">
          <Avatar className="w-52 h-52 sm:w-64 sm:h-64">{organization.name}</Avatar>
          <div className="mx-12 min-w-0">
            <Typography className="text-18 sm:text-24 md:text-32 font-bold leading-none mb-8 tracking-tight">
              {organization.name}
            </Typography>

            <div className="flex items-center opacity-60 truncate">
              <Typography className="text-12 sm:text-14 font-medium mx-4 truncate">
                {organization.id}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDashboardHeader;