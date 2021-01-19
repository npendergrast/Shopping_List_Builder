//mport logo from './logo.svg';
//import './App.css';
import IngredientListComponenet from './IngredientsList/IngredientListComponent';
//import MenuListComponent from './MenuListComponent/MenuListComponent';
import BuildShoppingListComponent from './BuildShoppingListComponent/BuildShoppingListComponent';

function App() {
  return (
    <div className="App">
      <IngredientListComponenet />
      <BuildShoppingListComponent />
    </div>
  );
}

export default App;
