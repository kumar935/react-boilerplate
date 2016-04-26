import React from 'react'
import {render} from 'react-dom'

import App from './modules/App'
import Module1 from './modules/Module1/Module1'
import Module2 from './modules/Module2/Module2'

import {Router, Route, IndexRoute, browserHistory} from 'react-router'

render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {/* make them children of `App` */}
        <Route path="/module1" component={Module1}/>
        <Route path="/module2" component={Module2}/>
      </Route>
    </Router>
  ),
  document.getElementById('app')
)
