export const ROW = 0;
export const COLUMN = 1;
export const DOWNWARD_DIAGONAL = 2;
export const UPWARD_DIAGONAL = 3;

export default class Bingo {
  static compare(bingo1, bingo2) {
    if (bingo1.direction < bingo2.direction) return -1;
    if (bingo1.direction > bingo2.direction) return 1;
    if (bingo1.direction === bingo2.direction) {
      if (bingo1.number < bingo2.number) return -1;
      if (bingo1.number > bingo2.number) return 1;
    }
    return 0;
  }

  constructor(direction, number) {
    this.direction = direction;
    this.number = number;
  }

  toString() {
    switch (this.direction) {
      case ROW: {
        return `Row ${this.number}`;
      }
      case COLUMN: {
        return `Column ${this.number}`;
      }
      case DOWNWARD_DIAGONAL: {
        return 'Downward Diagonal';
      }
      case UPWARD_DIAGONAL: {
        return 'Upward Diagonal';
      }
      default: {
        return undefined;
      }
    }
  }
}

export function sortBingos(bingos) {
  return bingos.slice().sort(Bingo.compare);
}