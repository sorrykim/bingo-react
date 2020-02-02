import flow from 'lodash/flow';
import isEmpty from 'lodash/isEmpty';
import { ofType, combineEpics } from 'redux-observable';
import produce from 'immer';
import { mergeMap, mergeMapTo, mapTo } from 'rxjs/operators';

import { createBoard, findNewBingos, BOARD_SIZE, findCell } from "../utils/board";
import { endGame, statusSelector, PLAYING } from './game';
import { sortBingos } from '../models/bingo';

function createActionTypes(playerName) {
  return {
    TAKE_TURN: `bingo/${playerName}/TAKE_TURN`,
    CLICK_CELL: `bingo/${playerName}/CLICK_CELL`,
    MARK_CELL: `bingo/${playerName}/MARK_CELL`,
    ADD_BINGOS: `bingo/${playerName}/ADD_BINGOS`,
    WIN: `bingo/${playerName}/WIN`,
    LEAVE_TURN: `bingo/${playerName}/LEAVE_TURN`,
    RESET: `bingo/${playerName}/RESET`,
  };
}

function createSelectors(playerName) {
  return {
    isTurn: state => state[playerName].isTurn,
    board: state => state[playerName].board,
    bingos: state => state[playerName].bingos,
    get sortedBingos() { return flow(this.bingos, sortBingos) },
  };
}

function getInitialState() {
  return {
    isWinner: false,
    isTurn: false,
    board: createBoard(),
    bingos: [],
  }
}

function createReducer(actionTypes) {
  const { TAKE_TURN, MARK_CELL, ADD_BINGOS, WIN, LEAVE_TURN, RESET } = actionTypes;
  return function reducer(state = getInitialState(), action) {
    switch (action.type) {
      case TAKE_TURN: {
        return { ...state, isTurn: true };
      }
      case MARK_CELL: {
        const { number } = action;
        return produce(state, ({ board }) => {
          findCell(board, number).mark();
        })
      }
      case ADD_BINGOS: {
        const { bingos } = action;
        return produce(state, draft => {
          draft.bingos = [...draft.bingos, ...bingos];
        });
      }
      case LEAVE_TURN: {
        return { ...state, isTurn: false };
      }
      case WIN: {
        return {...state, isWinner: true};
      }
      case RESET: {
        return getInitialState();
      }
      default: {
        return state;
      }
    }
  }
}

function createActionCreators(actionTypes) {
  const {TAKE_TURN, MARK_CELL, CLICK_CELL, ADD_BINGOS, WIN, LEAVE_TURN, RESET} = actionTypes;
  return {
    takeTurn: () => ({ type: TAKE_TURN }),
    markCell: number => ({ type: MARK_CELL, number }),
    clickCell: number => ({ type: CLICK_CELL, number }),
    addBingos: bingos => ({ type: ADD_BINGOS, bingos }),
    win: () => ({ type: WIN }),
    leaveTurn: () => ({ type: LEAVE_TURN }),
    reset: () => ({ type: RESET }),
  };
}

function createEpic({MARK_CELL, CLICK_CELL, ADD_BINGOS, WIN}, selectors, actionCreators) {
  return combineEpics(
    action$ => action$.pipe(
      ofType(CLICK_CELL),
      mergeMap(({ number }) => {
        return [
          actionCreators.player.markCell(number),
          actionCreators.opponent.markCell(number),
          actionCreators.player.leaveTurn(),
          actionCreators.opponent.takeTurn(),
        ];
      })
    ),
    (action$, state$) => action$.pipe(
      ofType(MARK_CELL),
      mergeMap(({ number }) => {
        const actions = [];
        const state = state$.value;
        const playerBingos = findNewBingos(selectors.player.board(state), number);
        if (!isEmpty(playerBingos)) {
          actions.push(actionCreators.player.addBingos(playerBingos));
        }
        return actions;
      })
    ),
    (action$, state$) => action$.pipe(
      ofType(ADD_BINGOS),
      mergeMap(({ bingos }) => {
        const actions = [];
        const state = state$.value;
        const playerBingos = selectors.player.bingos(state);
        if (playerBingos.length >= BOARD_SIZE) {
          actions.push(actionCreators.player.win());
        }
        return actions;
      })
    ),
    (action$, state$) => action$.pipe(
      ofType(WIN),
      mergeMap(() => {
        return statusSelector(state$.value) === PLAYING ? [endGame()] : []
      })
    ),
  );
}

export default function createPlayerDuck(playerName, opponentName) {
  const actionTypes = {
    player: createActionTypes(playerName),
    opponent: createActionTypes(opponentName),
  };
  const selectors = {
    player: createSelectors(playerName),
    opponent: createSelectors(opponentName),
  };
  const reducer = createReducer(actionTypes.player);

  const actionCreators = {
    player: createActionCreators(actionTypes.player),
    opponent: createActionCreators(actionTypes.opponent),
  };

  const epic = createEpic(actionTypes.player, selectors, actionCreators);

  return {
    actionTypes: actionTypes.player, selectors: selectors.player, reducer,
    actionCreators: actionCreators.player, epic
  };
}