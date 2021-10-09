import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateLayout } from './layouts';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Provider } from 'react-redux';
import store from './states';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
          <PrivateLayout />
        </Switch>
      </Router>
      <Toaster />
    </Provider>
  );
}

export default App;
