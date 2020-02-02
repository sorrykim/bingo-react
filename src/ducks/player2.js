import flow from 'lodash/flow';
import isEmpty from 'lodash/isEmpty';
import { ofType } from 'redux-observable';

import { createBoard, findNewBingos, BOARD_SIZE } from "../utils/board";
import { endGame } from './game';
import { takeTurn as player1TakeTurn, boardSelector as player1BoardSelector } from './player1';
import {sortBingos} from '../models/bingo';

// action types
const TAKE_TURN = 'bingo/player2/TAKE_TURN';
const MARK_CELL = 'bingo/player2/MARK_CELL';
const ADD_BINGOS = 'bingo/player2/ADD_BINGOS';
const WIN = 'bingos/player2/WIN';
const LEAVE_TURN = 'bingo/player2/LEAVE_TURN';
const RESET = 'bingo/player2/RESET';

export function isTurnSelector(state) {
  return state.player2.isTurn;
}

export function boardSelector(state) {
  return state.player2.board;
}

export function bingosSelector(state) {
  return state.player2.bingos;
}

export function sortedBingosSelector(state) {
  return flow(bingosSelector, sortBingos)(state);
}

function initialize() {
  return {
    isWinner: false,
    isTurn: false,
    board: createBoard(),
    bingos: [],
  }
}

export default function reducer(state = initialize(), action) {
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
    case RESET: {
      return initialize();
    }
    default: {
      return state;
    }
  }
}

export function takeTurn() {
  return { type: TAKE_TURN }
}

export function markCell(number) {
  return { type: MARK_CELL, number }
}

export function addBingos(bingos) {
  return { type: ADD_BINGOS, bingos };
}

export function win() {
  return { type: WIN }
}

export function leaveTurn() {
  return { type: LEAVE_TURN }
}

export function resetPlayer() {
  return { type: RESET_PLAYER }
}

function leaveTurnEpic(action$, state$) {
  return action$.pipe(
    ofType(LEAVE_TURN),
    map(() => {
      const actions = [];
      const state = state$.value
      const bingos = bingosSelector(state);
      const player2Bingos = player2BingosSelector(state);
      const isBingo = bingos.length >= BOARD_SIZE;
      const isPlayer2Bingo = player2Bingos.length >= BOARD_SIZE;
      if (isBingo) actions.push(win());
      if (isPlayer2Bingo) actions.push(player2Win());
      isBingo || isPlayer2Bingo ? actions.push(endGame()) : actions.push(player1TakeTurn());
      return actions;
    })
  );
}

function markCellEpic(action$, state$) {
  action$.pipe(
    ofType(MARK_CELL),
    map(({ number }) => {
      const actions = [];
      const bingos = findNewBingos(boardSelector(state$.value), number);
      const player2Bingos = findNewBingos(player1BoardSelector(state$.value), number);
      if (!isEmpty(bingos)) actions.push(addBingos(bingos));
      if (!isEmpty(player2Bingos)) actions.push(addBingos(player2Bingos));
      actions.push(leaveTurn())
      return actions;
    })
  )
}