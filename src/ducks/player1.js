import createPlayerDuck from './player';

export const {
  actionTypes, selectors, reducer, actionCreators, epic
} = createPlayerDuck('player1', 'player2');

export default reducer;