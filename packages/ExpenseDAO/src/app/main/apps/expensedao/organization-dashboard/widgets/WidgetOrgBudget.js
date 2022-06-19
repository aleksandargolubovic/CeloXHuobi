import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import { memo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import MenuItem from '@mui/material/MenuItem';

function WidgetOrgBudget(props) {
  const widget = _.merge({}, props.widget);
  const theme = useTheme();


  return (
    <Paper className="w-full rounded-20 shadow">
      <div className="flex items-center justify-between p-20 h-64">
        <Typography className="text-16 font-medium">{widget.title}</Typography>
      </div>
      {['totalSpent'].map((id) => (
        <div key={id}>
          <div className="flex flex-col w-full p-20">
            <Typography className="text-13 font-semibold" color="textSecondary">
              {widget[id].title}
            </Typography>
            <div className="flex items-center">
              <Typography className="text-32 font-normal" color="textSecondary">
                 {props.currency}
              </Typography>
              <Typography className="text-32 mx-4 font-medium tracking-tighter">
                {widget[id].count}
              </Typography>
            </div>
          </div>
        </div>
      ))}
      {widget['remaining'] && (
        <div key={'remaining'}>
          <div className="flex flex-col w-full p-20">
            <Typography className="text-13 font-semibold" color="textSecondary">
              {widget.remaining.title}
            </Typography>
            <div className="flex items-center">
              <Typography className="text-32 font-normal" color="textSecondary">
                {props.currency}
              </Typography>
              <Typography className="text-32 mx-4 font-medium tracking-tighter">
                {widget.remaining.count}
              </Typography>
            </div>
          </div>
        </div>
      )}
      <Divider />
      <div className="flex flex-col w-full p-20">
        <Typography className="text-13 font-semibold" color="textSecondary">
          {widget.totalBudget.title}
        </Typography>
        <div className="flex items-center">
          <Typography className="text-32 font-normal" color="textSecondary">
            {props.currency}
          </Typography>
          <Typography className="text-32 mx-4 font-medium tracking-tighter">
            {widget.totalBudget.count}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}

export default memo(WidgetOrgBudget);
