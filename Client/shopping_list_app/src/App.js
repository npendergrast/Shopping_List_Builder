import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

//mport logo from './logo.svg';
//import './App.css';
import IngredientsComponenet from './IngredientsComponent/IngredientsComponent';
//import MenuListComponent from './MenuListComponent/MenuListComponent';
import BuildShoppingListComponent from './BuildShoppingListComponent/BuildShoppingListComponent';

import MenuComponent from './NavigationComponents/MenuComponent';
import AppBarComponent from './NavigationComponents/AppBarComponent';

import LoginComponent from './LoginComponent/LoginComponent';
import { useState } from 'react';

function App() {
  const [clicked, setClicked] = useState(1);

  return (
    <div className="App">
      <Router>
        <AppBarComponent
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
          <Route path="/ingredients">
            <IngredientsComponenet />
          </Route>
          <Route path="/buildlist">
            <BuildShoppingListComponent />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
