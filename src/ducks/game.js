const START = 'bingo/game/START';
const SWITCH = 'bingo/game/SWITCH';
const END = 'bingo/game/END';

export function isPlayer1ActiveSelector(state) {
  return state.game.player1;
}

export function isPlayer2ActiveSelector(state) {
  return state.game.player2;
}

export function isStartedSelector(state) {
  return state.game.isStarted;
}

export default function reducer(state = {
  isStarted: false,
  player1: false,
  player2: false,
  winner: undefined,
}, action) {
  switch (action.type) {
    case START: {
      return {
        isStarted: true,
        player1: true,
        player2: false,
        winner: undefined,
      };
    }
    case SWITCH: {
      return {
        ...state,
        player1: !state.player1,
        player2: !state.player2,
      };
    }
    case END: {
      return {
        ...state,
        player1: false,
        player2: false,
        winner: action.winner,
      }
    }
    default: {
      return state;
    }
  }
}

export function startGame() {
  return { type: START };
}

export function endGame(winner) {
  return { type: END, winner };
}

export function switchTurn() {
  return { type: SWITCH };
}