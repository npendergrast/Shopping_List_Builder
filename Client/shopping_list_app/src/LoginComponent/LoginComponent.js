import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

import { userLogin } from '../ApiCalls/apiCalls';
import SnackbarAlertComponent from '../GenericComponents/SnackbarAlertComponent';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    marginBottom: '30px',
    transform: 'scale(3)',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [alertState, setAlertState] = useState(false);

  useEffect(() => {
    if (userName !== '' && password !== '') {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [userName, password]);

  const onClickHandler = (event) => {
    event.preventDefault();
    const credentials = { userName: userName, password: password };
    userLogin(credentials).then((response) => {
      if (response.success) {
        const { token, userID } = response;
        props.login(token, userID);
      } else {
        setAlertState({
          alert: true,
          type: 'error',
          message: response.message,
        });
      }
    });
  };

  const handleAlertClose = () => {
    setAlertState({ alert: false, type: 'error' });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <LocalDiningIcon className={classes.icon} />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            onChange={(e) => setUserName(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                checked={props.checked}
                onChange={props.checkHandler}
                color="primary"
              />
            }
            label="Remember me"
          />
          <Button
            onClick={onClickHandler}
            type="submit"
            disabled={buttonDisabled}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
      <SnackbarAlertComponent
        open={alertState.alert}
        close={handleAlertClose}
        message={alertState.message}
        type={alertState.type}
      />
    </Container>
  );
}
