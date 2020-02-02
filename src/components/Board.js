import React from 'react';
import { css } from 'emotion'
import classNames from 'classnames';

import Cell from './Cell';

export default function Board({ className, bingos, cells, isTurn, onCellClick }) {
  function handleCellClick(number) {
    if (isTurn) {
      onCellClick(number);
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
            isTurn={isTurn}
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
