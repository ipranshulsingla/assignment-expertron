/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import { name as appName } from './app.json';
import App from './src/App';
import createStore from './src/store/createStore';

const store = createStore();

const AppWithStore = () => (
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);

AppRegistry.registerComponent(appName, () => AppWithStore);
