import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

//mport logo from './logo.svg';
//import './App.css';
import IngredientListComponenet from './IngredientsList/IngredientListComponent';
//import MenuListComponent from './MenuListComponent/MenuListComponent';
import BuildShoppingListComponent from './BuildShoppingListComponent/BuildShoppingListComponent';

import NavigationComponent from './NavigationComponent/NavigationComponent';

import LoginComponent from './LoginComponent/LoginComponent';

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationComponent />
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/ingredients">Ingredients</Link>
              </li>
              <li>
                <Link to="/buildlist">Build shoppinglist</Link>
              </li>
              <li>
                <Link to="/user">User</Link>
              </li>
            </ul>
          </nav>
        </div>

        <Switch>
          <Route path="/ingredients">
            <IngredientListComponenet />
          </Route>
          <Route path="/buildlist">
            <BuildShoppingListComponent />
          </Route>
        </Switch>
      </Router>
      {/* <IngredientListComponenet />
      <BuildShoppingListComponent />
      <LoginComponent /> */}
    </div>
  );
}

export default App;
