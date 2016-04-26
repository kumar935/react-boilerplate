import React from 'react'

import {Link} from 'react-router'
import NavLink from './NavLink'

export default React.createClass({
  render() {
    return (
      <div>
        <h1>React Boilerplate</h1>
        <ul role="nav">
          <li><NavLink to="/module1" activeClassName="active">Module 1</NavLink></li>
          <li><NavLink to="/module2" activeClassName="active">Module 2</NavLink></li>
        </ul>

        {/* add this */}
        {this.props.children}

      </div>
    )
  }
})