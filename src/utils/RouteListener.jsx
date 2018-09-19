import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
// import NProgress from 'nprogress';
import DataService from '../services/DataService';

class RouteListener extends Component{
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    // if(NProgress.isStarted()) NProgress.remove();
    DataService.numberOfAjaxCAllPending = 0;
  }
  render(){
    return <span/>;
  }
}

export default withRouter(RouteListener);
