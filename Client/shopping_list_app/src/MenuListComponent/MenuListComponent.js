import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MenuListComponent(props) {
  const classes = useStyles();

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
                checked={props.checked.indexOf(value.id) !== -1}
                onChange={props.onChange(value.id)}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
