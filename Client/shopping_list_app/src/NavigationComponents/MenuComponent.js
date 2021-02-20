import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Button } from '@material-ui/core';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

import { Link } from 'react-router-dom';
import './MenuComponent.scss';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    left: true,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    if (state['left']) {
      setState({ left: false });
    } else {
      setState({ left: true });
    }
  }, [props.open]);

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link className="menu-link" to="/ingredients">
          <ListItem button key={'1'}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary={'Ingredients'} />
          </ListItem>
        </Link>
      </List>
      <Link className="menu-link" to="/buildlist">
        <ListItem button key={'2'}>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary={'Build Shopping List'} />
        </ListItem>
      </Link>
      <Divider />
    </div>
  );

  return (
    <div>
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        <Button onClick={toggleDrawer('left', false)}>
          <LocalDiningIcon fontSize="large" />
        </Button>
        {list('left')}
      </Drawer>
    </div>
  );
}
