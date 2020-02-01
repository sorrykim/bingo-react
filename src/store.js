import { createStore } from "redux";
import reduxLogger from 'redux-logger';

import rootReducer from './ducks';

export default createStore(
  rootReducer,
  applyMiddleware(reduxLogger),
);