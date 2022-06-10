import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { useCelo } from '@celo/react-celo';
import RequestsStatus from '../request/RequestsStatus';
import { selectRequests, getRequests } from '../store/requestsSlice';
import RequestsTableHead from './RequestsTableHead';

function RequestsTable(props) {
  const dispatch = useDispatch();
  const organization = useSelector(({ expensedaoorg }) => expensedaoorg.organization);
  const { address } = useCelo();
  const requests = useSelector(selectRequests);
  const searchText = useSelector(({ expensedao }) => expensedao.requests.searchText);


  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(requests);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [request, setRequest] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
      dispatch(getRequests({organization, address}))
        .then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(FuseUtils.filterArrayByString(requests, searchText));
      setPage(0);
    } else {
      setData(requests);
    }
  }, [requests, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (request.id === property && request.direction === 'desc') {
      direction = 'asc';
    }

    setRequest({
      direction,
      id,
    });
  }

  function handleClick(item) {
    props.navigate(`/apps/expensedao/requests/${organization.id}/${item.id}`);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There are no requests!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <RequestsTableHead
            request={request}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (request.id) {
                    case 'id': {
                      return parseInt(o.id, 10);
                    }
                    default: {
                      return o[request.id];
                    }
                  }
                },
              ],
              [request.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={n.id}
                    onClick={(event) => handleClick(n)}
                  >

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.id}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.creator}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {/* <span></span> */}
                      {n.amount}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.category}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      <RequestsStatus name={n.status} />
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.date}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(RequestsTable);
