import React from 'react';
import { css } from 'emotion'
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import Cell from './Cell';
import { markCell } from '../ducks/board';
import { switchTurn } from '../ducks/game';
import { useSelector } from 'react-redux/lib/hooks/useSelector';

export default function Board({ className, bingos, cells, isActive }) {
  const dispatch = useDispatch();
  const isBoard1BingoMade = useSelector(isBoard1BingoMade)

  function handleCellClick(number) {
    if (isActive) {
      dispatch(markCell(number));
      // check and record bingo

      dispatch(switchTurn());
    }
  }

  return (
    <div>
      <div
        className={classNames(css`
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        margin: 10px;
        width: 400px;
        height: 400px;
        border: 1px solid;
      `, className)}
      >
        {cells.map(({ number, isMarked }, index) => (
          <Cell
            key={index}
            number={number}
            isMarked={isMarked}
            onClick={handleCellClick}
            isActive={isActive}
          />
        ))}
      </div>
      <ul
        className={css`
          text-align: start;
        `}
      >
        {bingos.map((bingo, index) => (
          <li key={index}>{bingo.toString()}</li>
        ))}
      </ul>
    </div>
  )
}
