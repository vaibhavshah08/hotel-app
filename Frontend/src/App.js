import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Hero from './components/Hero';
import Admin from './components/Admin';

function App() {
  return (
    <>
      <Router>

        <Switch>

          <Route exact path="/">
            <Hero />
          </Route>

          <Route exact path="/admin">
            <Admin/>
          </Route>

        </Switch>

      </Router>
    </>
  );
}

export default App;
