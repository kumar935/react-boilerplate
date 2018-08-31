import React, { Component } from 'react';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
    // if(process.env.NODE_ENV === 'production') DataService.postToSlack(
    //   `${window.location.href}: ${error.message}`,
    //   info.componentStack
    // );

    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container">
          <div className="error-msg-container">
            <h1>Something went wrong.</h1>
            <br/><br/>
            <a href="/app/landing" className="button">Go to Dashboard</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
