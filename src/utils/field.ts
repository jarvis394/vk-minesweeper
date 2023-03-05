import { BOMBS_AMOUNT, FIELD_SIZE } from 'src/config/constants'
import { Cell, CellState, CellValue } from 'src/types/Cell'
import { isBomb, isBombCovered } from './cell'

export const isInBounds = (x: Cell['x'], y: Cell['y'], fieldSize: number) => {
  return x >= 0 && x < fieldSize && y >= 0 && y < fieldSize
}

export const getAdjacentCells = (
  cell: Cell,
  field: Cell[][]
): Array<Cell | null> => {
  const dx = [-1, 0, 1, -1, 1, -1, 0, 1]
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1]
  const res: Array<Cell | null> = []

  dx.forEach((x, i) => {
    const y = dy[i]

    if (isInBounds(cell.x + x, cell.y + y, field.length)) {
      res.push(field[cell.y + y][cell.x + x])
    } else {
      res.push(null)
    }
  })

  return res
}

export const calculateCellValues = (
  cells: Cell[][],
  bombs: Cell[]
): Cell[][] => {
  // Count value for each bomb's neighbours cells, because only them would have value >0
  bombs.forEach((bomb) => {
    const bombAdjacentCells = getAdjacentCells(cells[bomb.y][bomb.x], cells)

    bombAdjacentCells.forEach((cell) => {
      if (!cell || isBomb(cell)) return

      let value = CellValue.EMPTY
      const adjacentCells = getAdjacentCells(cells[cell.y][cell.x], cells)

      adjacentCells.forEach((cell) => {
        cell && isBomb(cell) && value++
      })

      cells[cell.y][cell.x].value = value
    })
  })

  return cells
}

export const generateCellsFunction = (
  fieldSize: number
): { cells: Cell[][]; bombs: Cell[] } => {
  const cells: Cell[][] = []

  for (let col = 0; col < fieldSize; col++) {
    cells[col] = []
    for (let row = 0; row < fieldSize; row++) {
      cells[col][row] = {
        x: row,
        y: col,
        state: CellState.CLOSED,
        value: CellValue.EMPTY,
      }
    }
  }

  const bombs = []
  while (bombs.length < BOMBS_AMOUNT) {
    const randX = Math.floor(Math.random() * FIELD_SIZE)
    const randY = Math.floor(Math.random() * FIELD_SIZE)

    if (!isBomb(cells[randY][randX])) {
      cells[randY][randX].value = CellValue.BOMB
      bombs.push(cells[randY][randX])
    }
  }

  calculateCellValues(cells, bombs)

  return {
    cells,
    bombs,
  }
}

export const checkIfWon = (cells: Cell[][]) => {
  let hasWon = true

  cells.forEach((row) =>
    row.forEach((cell) => {
      if (!isBombCovered(cell)) {
        hasWon = false
        return
      }
    })
  )

  return hasWon
}
