import React from 'react';


class Home extends React.Component {
  render() {
    return (
      <div>
        hello, world
        <div className="main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Home;