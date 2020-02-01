import flow from 'lodash/flow';
import produce from 'immer';

// action types
const ADD = 'bingo/bingo/ADD';
const RESET = 'bingo/bingo/RESET';

// bingos keys
export const BINGOS_1 = 'bingos1';
export const BINGOS_2 = 'bingos2';

export function bingos1Selector(state) {
  return state.bingos[BINGOS_1];
}

export function bingos2Selector(state) {
  return state.bingos[BINGOS_2];
}

function sortBingos(bingos) {
  return bingos.sort((bingo1, bingo2) => bingo1.compareTo(bingo2));
}

export function sortedBingos1Selector(state) {
  return flow(bingos1Selector, sortBingos)(state)
}

export function sortedBingos2Selector(state) {
  return flow(bingos1Selector, sortBingos)(state)
}

function initialize() {
  return {
    [BINGOS_1]: [], [BINGOS_2]: []
  };
}

export default function reducer(state = initialize(), action) {
  switch (action.type) {
    case ADD: {
      const { key, bingos } = action;
      return produce(state, draft => {
        draft[key] = [...draft[key], ...bingos]
      });
    }
    case RESET: {
      return initialize();
    }
    default: {
      return state;
    }
  }
}

export function resetBingos() {
  return { type: RESET };
}

export function addBingos(key, bingos) {
  return { type: ADD, key, bingos };
}