
import withReducer from 'app/store/withReducer';
import reducer from '../store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

function ReceiptDialog(props) {

    function handleCloseDialog() {
        props.setOpenDialog(false);
    }

    return (
        <Dialog
            open={props.openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="form-dialog-title"
            scroll="body"
        >
            <DialogContent>
                <img src={props.receipt} />
            </DialogContent>
        </Dialog>
    );
}

export default withReducer('expensedao', reducer)(ReceiptDialog);
