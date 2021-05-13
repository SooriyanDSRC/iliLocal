import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import { clearSnackbar } from "../../store/action/snackbarAction";
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function SnackBar() {
    const classes = useStyles();

    const dispatch = useDispatch();

    const { successSnackbarMessage, snackbarOpen, failureSnackbarMessage, severity } = useSelector(
        state => state.snackbar
    );

    function handleClose() {
        dispatch(clearSnackbar());
    }

    return (
        <div className={classes.root}>
            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}>
                <Alert onClose={handleClose} severity={severity}>
                    {severity === 'success' ? successSnackbarMessage : failureSnackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}