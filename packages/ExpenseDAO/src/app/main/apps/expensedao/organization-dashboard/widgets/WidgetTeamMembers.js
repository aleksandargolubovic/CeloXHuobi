import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import { useCelo } from '@celo/react-celo';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Blockies from "react-blockies";
import { getTeamMembers, selectTeamMembers } from '../store/teamMembersSlice'


function WidgetTeamMembers(props) {
  const { address, performActions } = useCelo();

  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMemberAddr, setNewMemberAddr] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTeamMembers({
      contract: organization.contract
    })).then(() => setLoading(false));
  }, [dispatch]);

  const widget = useSelector(selectTeamMembers)[0];

  async function handleRemove(memberAddress) {
    try {
      await performActions(async () => {
        const gasLimit = await organization.contract.methods
          .removeMember(memberAddress).estimateGas();

        const result = await organization.contract.methods
          .removeMember(
            memberAddress)
          .send({ from: address, gasLimit });

        console.log(result);
      });
    } catch (e) {
      console.log(e);
    }
    dispatch(getTeamMembers({
      contract: organization.contract
    }))
  }

  async function handleAdd() {
    setButtonLoading(true);
    try {
      await performActions(async () => {
        const gasLimit = await organization.contract.methods
          .addMember(newMemberAddr).estimateGas();

        const result = await organization.contract.methods
          .addMember(
            newMemberAddr)
          .send({ from: address, gasLimit });

        console.log(result);
      });
    } catch (e) {
      console.log(e);
    }
    dispatch(getTeamMembers({
      contract: organization.contract
    })).then(() => { setOpenDialog(false); setButtonLoading(false) })
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <>
      <Paper className="w-full rounded-20 shadow overflow-hidden">
        <div className="flex items-center justify-between p-20 h-64">
          <Typography className="text-16 font-medium">
            {widget.title}
            <IconButton onClick={() => { setOpenDialog(true) }} size="large">
              <Icon color="blue">add_circle</Icon>
            </IconButton>
          </Typography>

          <Typography className="text-11 font-500 rounded-4 text-white bg-blue px-8 py-4">
            {`${widget.table.rows.length} Members`}
          </Typography>
        </div>
        <div className="table-responsive">
          <Table className="w-full min-w-full" size="small">
            <TableHead>
              <TableRow>
                {widget.table.columns.map((column) => {
                  switch (column.id) {
                    case 'avatar': {
                      return (
                        <TableCell key={column.id} className="whitespace-nowrap p-8 px-16">
                          {column.title}
                        </TableCell>
                      );
                    }
                    default: {
                      return (
                        <TableCell key={column.id}>
                          <Typography
                            color="textSecondary"
                            className="font-semibold whitespace-nowrap p-8 px-16"
                          >
                            {column.title}
                          </Typography>
                        </TableCell>
                      );
                    }
                  }
                })}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {widget.table.rows.map((row) => (
                <TableRow key={row.id} className="h-64">
                  {row.cells.map((cell) => {
                    switch (cell.id) {
                      case 'avatar': {
                        return (
                          <TableCell key={cell.id} component="th" scope="row" className="px-16">
                            <Avatar><Blockies size={10} seed={cell.value.toLowerCase()} /></Avatar>
                          </TableCell>
                        );
                      }
                      default: {
                        return (
                          <TableCell key={cell.id} component="th" scope="row" className="truncate">
                            {cell.value}
                          </TableCell>
                        );
                      }
                    }
                  })}
                  <TableCell>
                    {row.cells[2].value === "Member" &&
                      <IconButton onClick={() => { handleRemove(row.cells[0].value) }} size="large">
                        <Icon>delete</Icon>
                      </IconButton>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="form-dialog-title"
        scroll="body"
      >
        <AppBar position="static" elevation={0}>
          <Toolbar className="flex w-full">
            <Typography variant="subtitle1" color="inherit">
              Add New Member
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            required
            value={newMemberAddr}
            style={{ width: 500 }}
            label="Address"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              console.log("newValue");
              console.log(event.target.value);
              setNewMemberAddr(event.target.value);
            }}
          />
          <br /><br />
          <LoadingButton
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            onClick={handleAdd}
            loading={buttonLoading}
          >
            Add New Member
          </LoadingButton>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(WidgetTeamMembers);
