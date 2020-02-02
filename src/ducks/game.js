import { mergeMapTo, mergeMap } from 'rxjs/operators';
import {ofType, combineEpics} from 'redux-observable';

import { actionCreators as player1ActionCreators, selectors as player1Selectors } from './player1';
import { actionCreators as player2ActionCreators, selectors as player2Selectors } from './player2';

// statuses
export const READY = 0;
export const PLAYING = 1;
export const ENDED = 2;

// action types
const PLAY = 'bingo/game/PLAY';
const END = 'bingo/game/END';
const RESET = 'bingo/game/RESET';

// selectors
export function statusSelector(state) {
  return state.game.status;
}

const INITIAL_STATE = {status: READY};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PLAY: {
      return { status: PLAYING }
    }
    case END: {
      return { status: ENDED };
    }
    case RESET: {
      return INITIAL_STATE;
    }
    default: {
      return state;
    }
  }
}

export function playGame() {
  return { type: PLAY };
}

export function endGame() {
  return { type: END };
}

export function resetGame() {
  return { type: RESET };
}

function playGameEpic(action$) {
  return action$.pipe(
    ofType(PLAY),
    mergeMapTo([player1ActionCreators.reset(), player2ActionCreators.reset(), player1ActionCreators.takeTurn()])
  )
}

function endGameEpic(action$, state$) {
  return action$.pipe(
    ofType(END),
    mergeMap(() => {
      const actions = [];
      const state = state$.value;
      if (player1Selectors.isTurn(state)) actions.push(player1ActionCreators.leaveTurn());
      if (player2Selectors.isTurn(state)) actions.push(player2ActionCreators.leaveTurn());
      return actions;
    })
  )
}

export const epic = combineEpics(playGameEpic, endGameEpic);