import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Error404 from '../pages/errors/404';
import SignIn from '../pages/SignIn';
import AppInfo from '../pages/AppInfo';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={SignIn} />
        <Route path="/dashboard" exact={true} component={Dashboard} />
        <Route path="/dashboard/:name" exact={true} component={AppInfo} />
        <Route component={Error404} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
