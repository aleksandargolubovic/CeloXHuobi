import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

function WidgetReqNum(props) {
  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="text-center py-12">
        <Typography className={`text-72 font-semibold leading-none text-${props.color} tracking-tighter`}>
          {props.widget.data.count}
        </Typography>
        <Typography className={`text-18 font-normal text-${props.color}-800`}>
          {props.widget.data.name}
        </Typography>
      </div>
    </Paper>
  );
}

export default memo(WidgetReqNum);
