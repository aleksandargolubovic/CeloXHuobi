import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EnterOrganizationDialog from './EnterOrganizationDialog';




const Root = styled('div')(({ theme }) => ({
  '& .board': {
    transitionProperty: 'box-shadow border-color',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
}));

function ChooseOption(props) {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  /* useEffect(() => {
     dispatch(getBoards());
     return () => {
       dispatch(resetBoards());
     };
   }, [dispatch]);
 */
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Root className="flex grow shrink-0 flex-col items-center">
      <div className="flex grow shrink-0 flex-col items-center container px-16 md:px-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
          <Typography
            className="mt-44 sm:mt-88 sm:py-24 text-32 sm:text-40 font-bold"
            color="inherit"
          >
            Choose an Option
          </Typography>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap w-full justify-center py-32 px-16"
        >
          <motion.div variants={item} className="w-224 h-224 p-16">
            <Paper
              className="flex flex-col items-center justify-center w-full h-full rounded-16 py-24 shadow hover:shadow-lg outline-none cursor-pointer"
              onClick={() => setOpenDialog(true)}
              role="button"
              tabIndex={0}
            >
              <Icon className="text-56" color="secondary">
                assessment
              </Icon>
              <Typography className="text-16 font-medium text-center pt-16 px-32" color="inherit">
                Enter existing organization
              </Typography>
            </Paper>
          </motion.div>
          <motion.div variants={item} className="w-224 h-224 p-16">
            <Paper
              className="flex flex-col items-center justify-center w-full h-full rounded-16 py-24 shadow hover:shadow-lg outline-none cursor-pointer"
              component={Link}
              to="/apps/expensedao/organizations/new"
              role="button"
              tabIndex={0}
            >
              <Icon className="text-56" color="secondary">
                add_circle
              </Icon>
              <Typography className="text-16 font-medium text-center pt-16 px-32" color="inherit">
                Create new organization
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </div>
      <EnterOrganizationDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
    </Root>
  );
}
              /* onClick={() => dispatch(newBoard())}
              onKeyDown={() => dispatch(newBoard())} */
/* export default withReducer('scrumboardApp', reducer)(Boards); */
export default ChooseOption;