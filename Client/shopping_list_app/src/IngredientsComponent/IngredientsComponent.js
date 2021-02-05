import React, { useState, useEffect } from 'react';
import { getIngredients, getIngredientTypes } from '../ApiCalls/apiCalls';
import Box from '@material-ui/core/Box';
import IngredientListComponent from './IngredientListComponent';
import InputFieldComponent from '../GenericComponents/InputFieldComponent';
import IngredientModal from './IngredientModal';
import AddButtonComponent from '../GenericComponents/AddButtonComponent';
import AlertComponent from '../GenericComponents/AlertComponent';

const IngredientList = () => {
  const [list, setList] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [typeState, setTypeState] = useState();
  const [idState, setIdState] = useState();
  const [includeState, setIncludeState] = useState();
  const [ingredientState, setIngredientState] = useState();
  const [errorState, setErrorState] = useState({});

  useEffect(() => {
    getIngredients().then((items) => {
      setList(items);
      setFilteredList(items);
    });
    getIngredientTypes().then((items) => {
      setTypes(items);
    });
  }, []);

  const onSearchHandler = (e) => {
    const filteredArray = list.filter((row) =>
      row.ingredient.toLowerCase().match(e.target.value.toLowerCase())
    );
    setFilteredList(filteredArray);
  };

  const onRowClickHandler = (row) => {
    setModalData(row);
    setEditModalOpen(true);
  };

  const onCloseHandler = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
  };

  const onClickHandler = () => {
    setAddModalOpen(true);
  };

  const modalDropDownValue = (value) => {
    setTypeState(value);
  };

  const switchStateHandler = (value) => {
    setIncludeState(value);
  };

  const currentIngredient = (value) => {
    setIngredientState(value);
  };

  const currentType = (value) => {
    setTypeState(value);
  };

  const currentID = (value) => {
    setIdState(value);
  };

  const ingredientValue = (event) => {
    setIngredientState(event.target.value);
  };

  const handleAlertClose = () => {
    setErrorState({});
  };

  const saveHandler = () => {
    if (idState !== '') {
      if (ingredientState.trim() === '') {
        setErrorState({
          error: true,
          message: 'Please enter and ingredient name',
        });
      }
    }
  };

  return (
    <Box>
      <InputFieldComponent onChange={onSearchHandler} label={'Search'} />
      <AddButtonComponent onClick={onClickHandler} />
      <IngredientListComponent
        ingredients={filteredList}
        rowClick={onRowClickHandler}
      />
      {editModalOpen && (
        <IngredientModal
          open={editModalOpen}
          data={modalData}
          ingredient={ingredientValue}
          getCurrentIngredient={currentIngredient}
          getCurrentType={currentType}
          getCurrentID={currentID}
          dropDown={types}
          dropDownValue={modalDropDownValue}
          close={onCloseHandler}
          title="Edit Ingredient"
          switchStateHandler={switchStateHandler}
          onClick={saveHandler}
          isEditModal={true}
        />
      )}
      {addModalOpen && (
        <IngredientModal
          open={addModalOpen}
          data={{ include: true, ingredient: '', type: '', id: '' }}
          ingredient={ingredientValue}
          getCurrentIngredient={currentIngredient}
          getCurrentType={currentType}
          getCurrentID={currentID}
          dropDown={types}
          dropDownValue={modalDropDownValue}
          close={onCloseHandler}
          title="Add Ingredient"
          switchStateHandler={switchStateHandler}
          onClick={saveHandler}
        />
      )}
      <AlertComponent
        open={errorState.error}
        close={handleAlertClose}
        message={errorState.message}
      />
    </Box>
  );
};

export default IngredientList;
