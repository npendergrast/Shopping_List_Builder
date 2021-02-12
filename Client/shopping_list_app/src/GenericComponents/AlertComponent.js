import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';

export default function AlertDialog(props) {
  let bgColor;
  if (props.type === 'error') {
    bgColor = '#ff8080';
  } else {
    bgColor = '#00cc00';
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: bgColor,
      color: 'white',
      width: '300px',
      textAlign: 'center',
    },
    text: {
      color: 'white',
    },
  }));

  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.close}
        onClick={props.close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={classes.root}>
          <DialogContentText
            className={classes.text}
            id="alert-dialog-description"
          >
            {props.message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
