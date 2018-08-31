import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import RouteListener from "../utils/RouteListener";

// __webpack_public_path__ = `${window.CONST.remoteJsUrl}/dist/`;
// if(process.env.DEV === true){
//   let isChrome = !!window.chrome && !!window.chrome.webstore;
//   if(isChrome) require('react-perf-devtool')();
// }

import AsyncComponent from './AsyncCompnent';
// import DataStore from '../services/DataStore';
// import DataService from '../services/DataService';
// import Modal from '../utils/comp/Modal';
import ToastUtil from '../utils/ToastUtil';
import ErrorBoundary from '../utils/ErrorBoundary';

const App = () => import(/* webpackChunkName: "App" */'./App/index');
const Login = () => import(/* webpackChunkName: "Login" */'./Login/index');

export const Root = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <div className="app">
        <div className="module-switcher">
          <Switch>
            <Route path="/app" component={props => <AsyncComponent moduleProvider={App} {...props} />} />
            <Route path="/login" component={props => <AsyncComponent moduleProvider={Login} {...props} />} />
            <Route path="/" render={() => (<Redirect to="/login"/>)}/>
          </Switch>
        </div>
        <ToastUtil/>
        <RouteListener/>
      </div>
    </ErrorBoundary>
  </BrowserRouter>
);

