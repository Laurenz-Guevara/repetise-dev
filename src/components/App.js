import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Signup from './Signup';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from './UpdateProfile'
import Stats from './Stats'
import Welcome from './Welcome'
import ContactUs from './ContactUs'
import '../styles/login-form.scss';
import '../styles/header.scss';
import '../styles/widget.scss';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path='/' component={Dashboard} />
          <PrivateRoute exact path='/update-profile' component={UpdateProfile} />
          <PrivateRoute exact path='/stats' component={Stats} />
          <Route path="/welcome-to-repetise" component={Welcome} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/contact-us" component={ContactUs} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
