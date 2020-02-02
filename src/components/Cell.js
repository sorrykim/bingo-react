import React from 'react';
import { css } from 'emotion';

export default function Cell({ number, isMarked = false, onClick = () => {}, isTurn }) {
  function handleClick(number) {
    if (isTurn && !isMarked) {
      onClick(number);
    }
  }
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid;
        background-color: ${isMarked ? 'grey' : 'none'};
        text-align: center;
        cursor: ${isTurn ? 'pointer' : 'not-allowed'};
      `}
      onClick={() => handleClick(number)}
    >
      {number}
    </div>
  )
}