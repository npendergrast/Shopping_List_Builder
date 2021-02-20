import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

//import './App.css';
import IngredientsComponenet from './IngredientsComponent/IngredientsComponent';
//import MenuListComponent from './MenuListComponent/MenuListComponent';
import BuildShoppingListComponent from './BuildShoppingListComponent/BuildShoppingListComponent';

import MenuComponent from './NavigationComponents/MenuComponent';
import AppBarComponent from './NavigationComponents/AppBarComponent';
import LoginComponent from './LoginComponent/LoginComponent';

function App() {
  const [clicked, setClicked] = useState(1);
  const [authenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [storeToken, setStoreToken] = useState(true);

  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');
    const expiryDateInStorage = localStorage.getItem('expires');
    if (tokenInStorage && expiryDateInStorage) {
      setAuthenticated(true);
      setAccessToken(tokenInStorage);
      setExpiryDate(expiryDateInStorage);
    }
  }, []);

  const loginHandler = (token, userID, expires) => {
    if (storeToken) {
      localStorage.setItem('token', token);
      localStorage.setItem('userID', userID);
      localStorage.setItem('expires', expires);
    }
    setAccessToken(token);
    setAuthenticated(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('expires');
    setAccessToken({});
    setAuthenticated(false);
  };

  const checkHandler = (event) => {
    setStoreToken(event.target.checked);
  };

  return (
    <div className="App">
      <Router>
        {authenticated === true ? (
          <div>
            <AppBarComponent
              logoutClick={logoutHandler}
              onClick={() => {
                if (clicked === 1) {
                  setClicked(2);
                } else {
                  setClicked(1);
                }
              }}
            />
            <MenuComponent open={clicked} />

            <Switch>
              <Redirect from="/login" to="/ingredients" />
              <Route path="/ingredients">
                <IngredientsComponenet
                  token={accessToken}
                  expires={expiryDate}
                  cancelToken={logoutHandler}
                />
              </Route>
              <Route path="/buildlist">
                <BuildShoppingListComponent />
              </Route>
            </Switch>
          </div>
        ) : (
          <div>
            <Redirect from="*" to="/login" />
            <Route path="/login">
              <LoginComponent
                login={loginHandler}
                checked={storeToken}
                checkHandler={checkHandler}
              />
            </Route>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
