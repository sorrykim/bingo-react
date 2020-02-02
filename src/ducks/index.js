import { combineReducers, createStore, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import reduxLogger from 'redux-logger';

import game, {epic as gameEpic} from './game';
import player1, {epic as player1Epic} from './player1';
import player2, {epic as player2Epic} from './player2';

const rootReducer = combineReducers({
  game,
  player1,
  player2,
});

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(reduxLogger, epicMiddleware),
);

epicMiddleware.run(combineEpics(player1Epic, player2Epic, gameEpic));

export default store;