import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  label: {
    textAlign: 'left',
  },
}));

export default function SimpleSelect(props) {
  const typesArray = props.list;
  const classes = useStyles();
  const [type, setType] = React.useState(props.value);

  const handleChange = (event) => {
    setType(event.target.value);
    props.dropDownValue(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          className={classes.label}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          onChange={handleChange}
        >
          {typesArray.map((item) => {
            const ingredientType = item.type;
            const ingredientID = item.id;
            return (
              <MenuItem key={ingredientID} value={ingredientType}>
                {ingredientType}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
