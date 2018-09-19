import React, { Component } from 'react';
import NavigationSidebar from "../AdminLTE/NavigationSidebar";
import Header from "../AdminLTE/Header/Header";

class Login extends Component {
  componentDidMount(){
  }
  render() {
    return (
      <div className="dashboar">
        <Header/>
        <NavigationSidebar/>
      </div>
    );
  }
}

export default Login;
