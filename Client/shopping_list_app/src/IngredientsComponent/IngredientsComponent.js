import React, { useState, useEffect } from 'react';
import { getIngredients, getIngredientTypes } from '../ApiCalls/apiCalls';
import Box from '@material-ui/core/Box';
import IngredientListComponent from './IngredientListComponent';
import InputFieldComponent from '../GenericComponents/InputFieldComponent';
import IngredientModal from './IngredientModal';
import AddButtonComponent from '../GenericComponents/AddButtonComponent';
import AlertComponent from '../GenericComponents/AlertComponent';

import {
  addIngredient,
  editIngredient,
  deleteIngredient,
} from '../ApiCalls/apiCalls';

const IngredientList = (props) => {
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
  const [alertState, setAlertState] = useState({});

  const getIngredientList = () => {
    getIngredients(props.token).then((response) => {
      if (!response.auth) {
        props.cancelToken();
      } else {
        setList(response.data);
        setFilteredList(response.data);
      }
    });
  };

  useEffect(() => {
    getIngredientList();
    getIngredientTypes(props.token).then((items) => {
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
    setAlertState({});
  };

  const deleteHandler = () => {
    const deleteObject = {
      id: idState,
    };
    deleteIngredient(deleteObject).then((response) => {
      if (response.success) {
        setAlertState({
          alert: true,
          type: 'success',
          message: response.message,
        });
        getIngredientList();
        onCloseHandler();
      } else {
        setAlertState({
          alert: true,
          type: 'error',
          message: response.message,
        });
      }
    });
  };

  const saveHandler = () => {
    // Check if ingredient or type fields are empty
    if (ingredientState.trim() === '') {
      setAlertState({
        alert: true,
        type: 'error',
        message: 'Please enter an ingredient name',
      });
    } else {
      if (typeState.trim() === '') {
        setAlertState({
          alert: true,
          type: 'error',
          message: 'Please enter a type',
        });
      } else {
        // If there is an id then you are editing existing ingredient
        if (idState !== '') {
          // Check if any fields have been changed and give alert if not
          if (
            modalData.ingredient === ingredientState &&
            modalData.type === typeState &&
            modalData.include === includeState
          ) {
            setAlertState({
              alert: true,
              type: 'error',
              message: 'No fields have changed',
            });
          } else {
            // Send http edit request
            const saveObject = {
              ingredient: ingredientState,
              ingredientType: typeState,
              include: includeState,
              id: idState,
            };
            editIngredient(saveObject, props.token).then((response) => {
              if (!response.auth) {
                props.cancelToken();
              } else {
                if (response.success) {
                  setAlertState({
                    alert: true,
                    type: 'success',
                    message: response.message,
                  });
                  getIngredientList();
                  onCloseHandler();
                } else {
                  setAlertState({
                    alert: true,
                    type: 'error',
                    message: response.message,
                  });
                }
              }
            });
          }
        } else {
          // No id found so you are adding a new ingredient
          const saveObject = {
            ingredient: ingredientState,
            ingredientType: typeState,
            include: includeState,
          };
          addIngredient(saveObject, props.token).then((response) => {
            if (!response.auth) {
              props.cancelToken();
            } else {
              if (response.success) {
                setAlertState({
                  alert: true,
                  type: 'success',
                  message: response.message,
                });
                getIngredientList();
                onCloseHandler();
              } else {
                setAlertState({
                  alert: true,
                  type: 'error',
                  message: response.message,
                });
              }
            }
          });
        }
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
          delete={deleteHandler}
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
      {alertState.alert && (
        <AlertComponent
          open={alertState.alert}
          close={handleAlertClose}
          message={alertState.message}
          type={alertState.type}
        />
      )}
    </Box>
  );
};

export default IngredientList;
