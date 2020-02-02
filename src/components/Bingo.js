import React from 'react';
import { css } from 'emotion';
import { useSelector, useDispatch } from 'react-redux';

import Board from './Board';
import { playGame, statusSelector, READY, PLAYING, ENDED, resetGame } from '../ducks/game';
import { selectors as player1Selectors, actionCreators as player1ActionCreators } from '../ducks/player1';
import { selectors as player2Selectors, actionCreators as player2ActionCreators } from '../ducks/player2';

export default function Bingo() {
  const status = useSelector(statusSelector);
  const player1Bingos = useSelector(player1Selectors.sortedBingos);
  const player2Bingos = useSelector(player2Selectors.sortedBingos);
  const player1Board = useSelector(player1Selectors.board);
  const player2Board = useSelector(player2Selectors.board);
  const player1IsTurn = useSelector(player1Selectors.isTurn);
  const player2IsTurn = useSelector(player2Selectors.isTurn);
  const dispatch = useDispatch();

  const buttonText = status === READY ? 'Start'
    : status === PLAYING ? 'Restart'
    : 'Done';

  function handleButtonClick() {
    if (status === ENDED) dispatch(resetGame());
    else dispatch(playGame());
  }

  function handlePlayer1CellClick(number) {
    dispatch(player1ActionCreators.clickCell(number));
  }

  function handlePlayer2CellClick(number) {
    dispatch(player2ActionCreators.clickCell(number));
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
          bingos={player1Bingos} cells={player1Board} isTurn={player1IsTurn}
          player="player1" onCellClick={handlePlayer1CellClick}
        />
        <Board
          bingos={player2Bingos} cells={player2Board} isTurn={player2IsTurn}
          player="player2" onCellClick={handlePlayer2CellClick}
        />
      </div>
      <button
        className={css`
        width: 150px;
        height: 50px;
        cursor: pointer;
      `}
        onClick={handleButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
}