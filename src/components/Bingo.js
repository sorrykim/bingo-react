import React from 'react';
import { css } from 'emotion';
import { useSelector, useDispatch } from 'react-redux';

import Board from './Board';
import {
  playGame, isPlayer1ActiveSelector, isPlayer2ActiveSelector, isStartedSelector
} from '../ducks/game';
import { board1Selector, board2Selector, resetBoard } from '../ducks/board';
import { sortedBingos1Selector, sortedBingos2Selector, resetBingos } from '../ducks/bingos';

export default function Bingo() {
  const isStarted = useSelector(isStartedSelector);
  // TODO: need bingos to be memoized
  const bingos1 = useSelector(sortedBingos1Selector);
  const bingos2 = useSelector(sortedBingos2Selector);
  const board1 = useSelector(board1Selector);
  const board2 = useSelector(board2Selector);
  const isPlayer1Active = useSelector(isPlayer1ActiveSelector);
  const isPlayer2Active = useSelector(isPlayer2ActiveSelector);
  const dispatch = useDispatch();

  function handleStart() {
    if (isStarted) {
      dispatch(resetBoard());
      dispatch(resetBingos());
    }
    dispatch(playGame())
  }

  return (
    <div
      className={css`
        text-align: center;
      `}
    >
      <div
        className={css`
          display: flex;
          justify-content: center;
          margin: 30px;
        `}
      >
        <Board
          bingos={bingos1} cells={board1} isActive={isPlayer1Active}
          player="player1"
        />
        <Board
          bingos={bingos2} cells={board2} isActive={isPlayer2Active}
          player="player2"
        />
      </div>
      <button
        className={css`
          width: 150px;
          height: 50px;
          cursor: pointer;
        `}
        onClick={handleStart}
      >
        {isStarted ? 'Restart' : 'Start'}
      </button>
    </div>
  );
}