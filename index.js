import React from 'react';
import {render} from 'react-dom';

import './svg-icons.font';
import './scss/main.scss';

import './modernizr';
import Home from './components/Home/Home';
import Main from './components/Main/Main';
import {Router, Route, browserHistory} from 'react-router';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Home}>
      <Route path="/main" component={Main}/>
    </Route>
  </Router>
), document.getElementById('app'));
