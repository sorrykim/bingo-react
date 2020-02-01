import { combineReducers } from 'redux';

import game from './game';
import bingos from './bingos';
import board from './board';

export default combineReducers({
  game,
  bingos,
  board,
});