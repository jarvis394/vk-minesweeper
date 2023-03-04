export enum CellState {
  OPEN = 'open',
  CLOSED = 'closed',
  POKED = 'poked',
  FLAGGED = 'flagged',
  QUESTIONED = 'questioned',
}

export enum CellValue {
  BOMB = -1,
  EMPTY,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
}

export interface Cell {
  x: number
  y: number
  value: CellValue
  state: CellState
  isHighlightedAsBomb?: boolean
}
