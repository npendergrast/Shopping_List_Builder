import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InputFieldComponent from '../GenericComponents/InputFieldComponent';
import DropDownComponent from '../GenericComponents/DropDownComponent';
import SwitchComponent from '../GenericComponents/SwitchComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { Divider, Typography, Card } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [active, setActive] = useState();
  const [currentType, setCurrentType] = useState('');
  const [currentID, setCurrentID] = useState('');

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

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography align="center">{props.title}</Typography>
            <Divider />
            <InputFieldComponent
              label={'Ingredient'}
              defaultValue={currentIngredient}
              onChange={props.ingredient}
            />
            <DropDownComponent
              list={props.dropDown}
              dropDownValue={props.dropDownValue}
              value={props.data.type}
            />
            <SwitchComponent
              active={active}
              switchStateHandler={props.switchStateHandler}
            />
            <ButtonComponent label={'Save'} onClick={props.onClick} />
            <ButtonComponent onClick={props.close} label={'Cancel'} />
            {props.isEditModal && (
              <ButtonComponent label="Delete" onClick={props.delete} />
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
