import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import Co2Icon from '@mui/icons-material/Co2'
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoogleMap from 'google-map-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import RequestsStatus from '../RequestsStatus';
import ReceiptDialog from '../ReceiptDialog';



function Marker(props) {
  return (
    <Tooltip title={props.text} placement="top">
      <Icon className="text-red">place</Icon>
    </Tooltip>
  );
}

function RequestDetailsTab() {
  const request = useSelector(({ expensedao }) => expensedao.request);
  const [map, setMap] = useState('shipping');

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">account_circle</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Creator address
          </Typography>
        </div>

        <div className="mb-24">
          <Typography className="truncate mx-8">
            {`${request.creator}`}
          </Typography>
        </div>
      </div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">access_time</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Request Status
          </Typography>
        </div>
        <div className="mb-24">
          <RequestsStatus name={request.status} />
        </div>
      </div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">attach_money</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Amount
          </Typography>
        </div>

        <div className="mb-24">
          <span className="truncate">{request.amount}</span>
        </div>
      </div>

      { request.co2 !== '0' &&
        <div className="pb-24">
          <div className="pb-16 flex items-center">
            <Co2Icon color="action" />
            <Typography className="h2 mx-12 font-medium" color="textSecondary">
              Carbon Offset
            </Typography>
          </div>
          <div className="mb-24">
            <span className="truncate">{parseFloat(request.co2).toFixed(4)} t</span>
          </div>
        </div>
      }

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">today</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Date
          </Typography>
        </div>

        <div className="mb-24">
          <span className="truncate">{request.date}</span>
        </div>
      </div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">description</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Description
          </Typography>
        </div>

        <div className="mb-24">
          <TextField
            defaultValue={request.description}
            className="mt-8 mb-16"
            id="description"
            type="text"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>

      <div className="pb-24">
        <div className="pb-16 flex items-center">
          <Icon color="action">receipt_long</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Receipt
          </Typography>
        </div>

        <div className="mb-24">
          <Card
            className={clsx('cursor-pointer', "w-320 rounded-20 shadow mb-16")}
            onClick={() => setOpenDialog(true)}
          >
            <img src={request.receipt} className="w-full block" alt="note" />
          </Card>
        </div>
      </div>
      <ReceiptDialog openDialog={openDialog} setOpenDialog={setOpenDialog} receipt={request.receipt} />
    </div>
  );
}

export default RequestDetailsTab;
