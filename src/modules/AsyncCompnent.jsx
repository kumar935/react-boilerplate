import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import DataService from "../services/DataService";
// import EventService from "../services/EventService";

export default class AsyncComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      Component: null,
      loading: false
    };
  }

  componentWillMount() {
    if (!this.state.Component) {
      this.props.moduleProvider().then(({ Component }) => {
        // DataService.loadMetaData().then(resp=>{
        //   if(resp.status === 200){
            this.setState({ Component });
          // }
        // })
      });
    }
    // EventService.subscribe('setLoading', loading => this.setLoading(loading));
  }

  setLoading = (loading) => {
    this.setState({ loading });
  }

  render() {
    const { Component, loading } = this.state;

    // The magic happens here!
    return (
      <div className={loading ? 'loading-inline' : ''}>
        {Component ? <Component {...this.props} setLoading={this.setLoading}/> : (
          <div className="loading"/>
        )}
      </div>
    );
  }
}


AsyncComponent.propTypes = {
  moduleProvider: PropTypes.func,
};

AsyncComponent.defaultProps = {
  moduleProvider() {},
};
