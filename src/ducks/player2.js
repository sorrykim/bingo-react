import createPlayerDuck from './player';

export const {
  actionTypes, selectors, reducer, actionCreators, epic
} = createPlayerDuck('player2', 'player1');

export default reducer;