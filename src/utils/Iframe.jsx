import React, { Component } from 'react';

class Iframe extends Component {
  constructor(){
    super();
  }
  iframe(){
    return {
      __html: `<iframe src=${this.props.url} width="100%" height="100%" frameborder="0" allowtransparency="allowtransparency" marginheight="0" marginwidth="0"></iframe>`
    }
  }
  render(){
    return (
        <div className="iframe-wrapper" dangerouslySetInnerHTML={ this.iframe() } />
    );
  }
}

export default Iframe;
