import {isEmpty} from 'lodash/isEmpty';
import produce from 'immer';
import {ofType, mergeMap} from 'redux-observable';

import {createBoard, findCell, findNewBingos} from '../utils/board';
import { addBingos, BINGOS_1 } from './bingos';


// action types
const MARK = 'bingo/board/MARK';
const RESET = 'bingo/board/RESET';

// selectors
export function board1Selector(state) {
  return state.board.board1;
}

export function board2Selector(state) {
  return state.board.board2;
}

// initializer
function initialize() {
  return {
    board1: createBoard(),
    board2: createBoard(),
  };
}

export default function reducer(state = initialize(), action) {
  switch (action.type) {
    case MARK: {
      const { number } = action;
      return produce(state, ({board1, board2}) => {
        findCell(board1, number).mark();
        findCell(board2, number).mark();
      })
    }
    case RESET: {
      return initialize();
    }
    default: {
      return state;
    }
  }
}

// action creators
export function markCell(number) {
  return { type: MARK, number };
}
export function resetBoard() {
  return { type: RESET };
}

// epics
function markEpic(action$, state$) {
  return action$.pipe(
    ofType(MARK),
    map(({number}) => {
      // check board1 and board2 to add bingo
      const actions = [];
      const bingos1 = findNewBingos(board1Selector(state$.value), number);
      const bingos2 = findNewBingos(board2Selector(state$.value), number);
      if (!isEmpty(bingos1)) actions.push(addBingos(BINGOS_1, bingos1));
      if (!isEmpty(bingos2)) actions.push(addBingos(BINGOS_2, bingos2));
    })
  )
}