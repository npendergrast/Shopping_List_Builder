import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Import generic components
import InputFieldComponent from '../GenericComponents/InputFieldComponent';
import DropDownComponent from '../GenericComponents/DropDownComponent';
import SwitchComponent from '../GenericComponents/SwitchComponent';
import ConfirmationModal from '../GenericComponents/ConfirmationModal';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '280px',
  },
  button: {
    margin: theme.spacing(1),
  },
  middle: {
    height: '200px',
  },
  switch: {
    paddingTop: '20px',
  },
}));
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [active, setActive] = useState(props.data.include);
  const [currentType, setCurrentType] = useState('');
  const [currentID, setCurrentID] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    } else setOpen(false);
  }, [props.open]);

  useEffect(() => {
    setCurrentIngredient(props.data.ingredient);
    setActive(props.data.include);
    setCurrentType(props.data.type);
    setCurrentID(props.data.id);
  }, [props.data]);

  useEffect(() => {
    props.getCurrentIngredient(currentIngredient);
    props.getCurrentType(currentType);
    props.getCurrentID(currentID);
  }, [currentIngredient, currentType, currentID]);

  const deleteConfirmHandler = () => {};

  return (
    <div>
      <Dialog aria-labelledby="customized-dialog-title" open={open}>
        <Box className={classes.modal}>
          <DialogTitle align="center" id="customized-dialog-title">
            {props.title}
          </DialogTitle>
          <DialogContent dividers>
            <Box
              className={classes.middle}
              display="flex"
              flexDirection="column"
              align="center"
            >
              <InputFieldComponent
                label={'Ingredient Name'}
                defaultValue={currentIngredient}
                onChange={props.ingredient}
              />

              <DropDownComponent
                list={props.dropDown}
                dropDownValue={props.dropDownValue}
                value={props.data.type}
              />
              <Box className={classes.switch}>
                <SwitchComponent
                  active={active}
                  switchStateHandler={props.switchStateHandler}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              label="Save"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={props.onClick}
            >
              Save
            </Button>
            {props.isEditModal && (
              <Button
                label="Delete"
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => {
                  setConfirmOpen(true);
                }}
              >
                Delete
              </Button>
            )}
            <Button
              label="Cancel"
              variant="contained"
              color="default"
              className={classes.button}
              onClick={props.close}
            >
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      {confirmOpen && (
        <ConfirmationModal
          open={confirmOpen}
          cancel={() => {
            setConfirmOpen(false);
          }}
          confirm={props.delete}
          message="Are you sure you want to delete this ingredient?"
        />
      )}
    </div>
  );
}
