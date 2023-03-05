import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BOMBS_AMOUNT, FIELD_SIZE } from 'src/config/constants'
import { Cell, CellState, CellValue } from 'src/types/Cell'
import { GameState } from 'src/types/GameState'
import {
  calculateCellValues,
  generateCellsFunction,
  getAdjacentCells,
} from 'src/utils/field'
import exhaustivnessCheck from 'src/utils/exhaustivnessCheck'
import { isBomb, isOpenDisabledForCell } from 'src/utils/cell'
import { GameResult } from 'src/types/GameResult'

type FieldCells = Cell[][]
type FieldState = {
  size: number
  bombs: Cell[]
  flagsAmount: number
  cells: FieldCells
  openedCellsAmount: number
  gameState: GameState
  gameResult: GameResult | false
}

const initialState: FieldState = {
  size: FIELD_SIZE,
  cells: [],
  bombs: [],
  flagsAmount: 0,
  openedCellsAmount: 0,
  gameState: GameState.IDLE,
  gameResult: false,
}

const explodeBombAction = (state: FieldState, lastCell: Cell) => {
  const adjacentCells = getAdjacentCells(lastCell, state.cells)

  state.gameState = GameState.ENDED
  state.gameResult = GameResult.LOST

  if (lastCell.value === CellValue.BOMB) {
    state.cells[lastCell.y][lastCell.x].isHighlightedAsBomb = true
  } else {
    for (const neighbour of adjacentCells) {
      if (neighbour?.value === CellValue.BOMB) {
        state.cells[neighbour.y][neighbour.x].isHighlightedAsBomb = true
      }
    }
  }

  state.cells.map((row) => {
    return row.map((cell) => {
      if (isBomb(cell) && !isOpenDisabledForCell(cell)) {
        cell.state = CellState.OPEN
      }
      return cell
    })
  })
}

const openCellAction = (state: FieldState, cell: Cell) => {
  if (cell.state === CellState.OPEN || isOpenDisabledForCell(cell)) {
    return
  }

  switch (state.gameState) {
    case GameState.IDLE: {
      state.gameState = GameState.PLAYING

      // Regenerate field when first opened cell is a bomb
      if (isBomb(state.cells[cell.y][cell.x])) {
        const currentOpenedBombIndex = state.bombs.findIndex(
          (e) => e.x === cell.x && e.y === cell.y
        )
        let newBomb = { ...state.cells[0][0] }

        // We are finding new place for a bomb top-left to bottom-right
        // as Windows's Minesweeper did
        while (isBomb(state.cells[newBomb.y][newBomb.x])) {
          newBomb.x = (newBomb.x + 1) % state.size
          newBomb.y = newBomb.x === 0 ? newBomb.y + 1 : newBomb.y
        }

        state.cells[cell.y][cell.x].value = CellValue.EMPTY
        state.cells[newBomb.y][newBomb.x].value = CellValue.BOMB
        state.bombs.splice(currentOpenedBombIndex, 1)
        state.bombs.push(state.cells[newBomb.y][newBomb.y])

        const adjacentCells = getAdjacentCells(cell, state.cells)

        adjacentCells.forEach((neighbour) => {
          if (neighbour && !isBomb(neighbour)) {
            state.cells[neighbour.y][neighbour.x].value -= 1
          }
        })

        calculateCellValues(state.cells, state.bombs)
      }

      if (state.cells[cell.y][cell.x].value === CellValue.EMPTY) {
        openMultipleCellsAction(state, state.cells[cell.y][cell.x])
      } else {
        state.cells[cell.y][cell.x].state = CellState.OPEN
        state.openedCellsAmount += 1
      }
    }
    case GameState.PLAYING: {
      if (isBomb(state.cells[cell.y][cell.x])) {
        explodeBombAction(state, cell)
      }

      state.cells[cell.y][cell.x].state = CellState.OPEN
      state.openedCellsAmount += 1

      // Win game if all cells except bombs are opened
      if (state.openedCellsAmount === FIELD_SIZE * FIELD_SIZE - BOMBS_AMOUNT) {
        state.gameResult = GameResult.WON
      }
    }
    case GameState.ENDED:
      return
    default:
      exhaustivnessCheck(state.gameState)
  }
}

const openMultipleCellsAction = (state: FieldState, cell: Cell) => {
  const startingCell = state.cells[cell.y][cell.x]
  const setOpen = (cell: Cell) => {
    state.cells[cell.y][cell.x].state = CellState.OPEN
    state.openedCellsAmount += 1
  }

  if (state.gameState === GameState.IDLE) {
    state.gameState = GameState.PLAYING
  } else if (state.gameState === GameState.ENDED) return

  const openAdjacentCells = (currentCell: Cell) => {
    if (currentCell.state === CellState.OPEN || isOpenDisabledForCell(cell)) {
      return
    }

    setOpen(currentCell)
    const adjacentCells = getAdjacentCells(currentCell, state.cells)

    adjacentCells.forEach((cell) => {
      if (cell && cell.state !== CellState.OPEN && !isBomb(cell)) {
        if (cell.value === 0) {
          openAdjacentCells(cell)
        } else {
          setOpen(cell)
        }
      }
    })
  }

  openAdjacentCells(startingCell)
}

const GameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    /** Opens given cell and continiously opens cells that are connected with it with empty cells */
    openMultipleCellsAction(state, action: PayloadAction<{ cell: Cell }>) {
      openMultipleCellsAction(state, action.payload.cell)
    },
    /** Opens singular given cell */
    openCellAction(state, action: PayloadAction<{ cell: Cell }>) {
      openCellAction(state, action.payload.cell)
    },
    openPokedCells(state, action: PayloadAction<{ cell: Cell }>) {
      const { cell } = action.payload
      const adjacentCells = getAdjacentCells(cell, state.cells)
      const shouldOpenCells =
        adjacentCells.filter((e) => e && isOpenDisabledForCell(e)).length ===
        cell.value

      // We should open poked cells only when amount of neighbours flagged
      // is equal to the value of the given cell
      if (!shouldOpenCells) return

      adjacentCells.forEach((neighbour) => {
        if (!neighbour) return

        if (
          neighbour.value === CellValue.BOMB &&
          !isOpenDisabledForCell(neighbour)
        ) {
          explodeBombAction(state, cell)
        } else if (neighbour.state === CellState.CLOSED) {
          if (neighbour.value === CellValue.EMPTY) {
            openMultipleCellsAction(state, neighbour)
          } else {
            openCellAction(state, neighbour)
          }
        }
      })
    },
    /**
     * Highlights (sets sprite to `open` and `empty`) given cell and its neighbours
     */
    pokeCell(
      state,
      action: PayloadAction<{
        cell: Cell
        /** If true, unpokes cells. Defaults to `false` */
        reverse?: boolean
      }>
    ) {
      const { cell, reverse = false } = action.payload
      const eligibleStates = [CellState.POKED, CellState.CLOSED]
      if (isOpenDisabledForCell(cell) || state.gameState === GameState.ENDED) {
        return
      }

      if (eligibleStates.includes(cell.state)) {
        state.cells[cell.y][cell.x].state = reverse
          ? CellState.CLOSED
          : CellState.POKED
      } else {
        const adjacentCells = getAdjacentCells(cell, state.cells)
        adjacentCells.forEach((neighbour) => {
          // Poke cell only if it is closed, so we don't mess up its previous state
          if (neighbour && eligibleStates.includes(neighbour.state)) {
            state.cells[neighbour.y][neighbour.x].state = reverse
              ? CellState.CLOSED
              : CellState.POKED
          }
        })
      }
    },
    /** Flags or questions given cell */
    setFlag(state, action: PayloadAction<{ cell: Cell }>) {
      const { cell } = action.payload

      if (state.gameState === GameState.ENDED) return

      switch (cell.state) {
        case CellState.CLOSED:
          if (state.flagsAmount >= state.bombs.length) return

          state.cells[cell.y][cell.x].state = CellState.FLAGGED
          state.flagsAmount += 1
          break
        case CellState.FLAGGED:
          state.cells[cell.y][cell.x].state = CellState.QUESTIONED
          state.flagsAmount -= 1
          break
        case CellState.QUESTIONED:
          state.cells[cell.y][cell.x].state = CellState.CLOSED
          break
        default:
          break
      }
    },
    /** Sets game state to `ENDED` and reveals all bombs on the field */
    explodeBombAction(state, action: PayloadAction<{ lastCell: Cell }>) {
      explodeBombAction(state, action.payload.lastCell)
    },
    /** Creates random game field */
    generateCells(state) {
      const { cells, bombs } = generateCellsFunction(state.size)
      state.gameState = GameState.IDLE
      state.gameResult = false
      state.cells = cells
      state.bombs = bombs
    },
  },
})

export default GameSlice.reducer
export const {
  openCellAction: openCell,
  openMultipleCellsAction: openMultipleCells,
  explodeBombAction: explodeBomb,
  generateCells,
  pokeCell,
  openPokedCells,
  setFlag,
} = GameSlice.actions
