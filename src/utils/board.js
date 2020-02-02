import range from 'lodash/range';
import faker from 'faker';

import { Cell } from '../models/cell';
import Bingo, { ROW, COLUMN, DOWNWARD_DIAGONAL, UPWARD_DIAGONAL } from '../models/bingo';

export const BOARD_SIZE = 5;
export const BOARD_AREA = BOARD_SIZE * BOARD_SIZE;

export function createBoard() {
  return faker.helpers.shuffle(range(BOARD_AREA)).map(
    (number, index) => {
      const {row, column} = indexToCoordinate(index);
      return new Cell(number, row, column);
    }
  );
}

function coordinateToIndex(row, column) {
  if (row >= BOARD_SIZE) throw new Error('Row is too big');
  if (column >= BOARD_SIZE) throw new Error('Column is too large');
  return row * BOARD_SIZE + column;
}

function indexToCoordinate(index) {
  if (index >= BOARD_AREA) throw new Error('Index is too big');
  const row = Math.floor(index / BOARD_SIZE);
  const column = index % BOARD_SIZE;
  return {row, column};
}

export function findCell(board, number) {
  return board.find(cell => cell.number === number);
}

export function getCell(board, row, column) {
  return board[coordinateToIndex(row, column)]
}

function getRowCells(board, {row}) {
  return board.slice(coordinateToIndex(row, 0), coordinateToIndex(row, BOARD_SIZE - 1) + 1);
}

function getColumnCells(board, {column}) {
  return range(BOARD_SIZE).map(row => getCell(board, row, column));
}

function getDownwardDiagonalCells(board, cell) {
  if (!cell.isDownwardDiagonal()) throw new Error('No upward diagonal cells');
  return range(BOARD_SIZE).map(row => getCell(board, row, row));
}

function getUpwardDiagonalCells(board, cell) {
  if (!cell.isUpwardDiagonal()) throw new Error('No upward diagonal cells');
  return range(BOARD_SIZE).map(row => getCell(board, row, BOARD_SIZE - 1 - row));
}

function isBingo(cells) {
  return cells.every(({isMarked}) => isMarked);
}

export function findNewBingos(board, number) {
  const bingos = [];
  const cell = findCell(board, number);
  const {row, column} = cell;
  if (isBingo(getRowCells(board, cell))) {
    bingos.push(new Bingo(ROW, row));
  }
  if (isBingo(getColumnCells(board, cell))) {
    bingos.push(new Bingo(COLUMN, column));
  }
  if (cell.isDownwardDiagonal() && isBingo(getDownwardDiagonalCells(board, cell))) {
    bingos.push(new Bingo(DOWNWARD_DIAGONAL));
  }
  if (cell.isUpwardDiagonal() && isBingo(getUpwardDiagonalCells(board, cell))) {
    bingos.push(new Bingo(UPWARD_DIAGONAL));
  }
  return bingos;
}