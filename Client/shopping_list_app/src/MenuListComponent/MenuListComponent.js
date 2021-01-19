import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

//import { getRecipes } from '../ApiCalls/apiCalls';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MenuListComponent(props) {
  const classes = useStyles();
  // const [checked, setChecked] = React.useState([1]);
  //const [list, setList] = useState([]);

  //   useEffect(() => {
  //     let mounted = true;
  //     getRecipes().then((items) => {
  //       if (mounted) {
  //         setList(items);
  //       }
  //     });
  //     return () => (mounted = false);
  //   }, []);

  //   const handleToggle = (value) => () => {
  //     const currentIndex = checked.indexOf(value);
  //     const newChecked = [...checked];

  //     if (currentIndex === -1) {
  //       newChecked.push(value);
  //     } else {
  //       newChecked.splice(currentIndex, 1);
  //     }

  //     setChecked(newChecked);
  //     console.log(newChecked);
  //   };

  return (
    <List dense className={classes.root}>
      {props.list.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value.id}`;
        return (
          <ListItem key={value.id} button>
            <ListItemText id={labelId} primary={value.recipe_name} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                //onChange={handleToggle(value.id)}
                checked={props.checked.indexOf(value) !== -1}
                onChange={props.onChange}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
