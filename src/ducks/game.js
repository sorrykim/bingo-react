// statuses
const READY = 0;
const PLAYING = 1;
const ENDED = 2;

// action types
const PLAY = 'bingo/game/PLAY';
const END = 'bingo/game/END';
const RESET = 'bingo/game/RESET';

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