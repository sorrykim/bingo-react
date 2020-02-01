export const ROW = 0;
export const COLUMN = 1;
export const DOWNWARD_DIAGONAL = 2;
export const UPWARD_DIAGONAL = 3;

export class Bingo {
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

  compareTo(other) {
    if (this.direction < other.direction) return -1;
    if (this.direction > other.direction) return 1;
    if (this.direction === other.direction) {
      if (this.number < other.number) return -1;
      if (this.number > other.number) return 1;
    }
    return 0;
  }
}