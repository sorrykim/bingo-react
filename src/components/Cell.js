import React from 'react';
import { css } from 'emotion';

export default function Cell({ number, isMarked = false, onClick = () => {}, isActive }) {
  function handleClick(number) {
    if (isActive && !isMarked) {
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
        cursor: ${isActive ? 'pointer' : 'not-allowed'};
      `}
      onClick={() => handleClick(number)}
    >
      {number}
    </div>
  )
}