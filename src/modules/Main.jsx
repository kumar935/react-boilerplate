import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import {arrayFindPolyfill} from "../utils/Polyfills";
import {Root} from "./Root";

require('es6-promise').polyfill();
if(!Object.values) require('object.values').shim();
arrayFindPolyfill();
require('../style/main.scss');

const renderApp = () => {
  render(
    <AppContainer>
      <Root />
    </AppContainer>,
    document.getElementById('app')
  );
};

renderApp();

// DataStore.init();
// DataService.init().then(()=>{
//   renderApp();
// });

if (module.hot) {
  module.hot.accept();
}

