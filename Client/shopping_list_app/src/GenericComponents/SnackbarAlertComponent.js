import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
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
  snack: {
    marginTop: '60px',
  },
}));

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  let timeOut;

  if (props.type === 'success') {
    timeOut = 2500;
  } else {
    timeOut = 5000;
  }

  return (
    <div className={classes.root}>
      <Snackbar
        autoHideDuration={timeOut}
        className={classes.snack}
        open={props.open}
        TransitionProps={{
          exit: false,
          timeout: 200,
        }}
        onClose={props.close}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={props.type}>{props.message}</Alert>
      </Snackbar>
    </div>
  );
}
