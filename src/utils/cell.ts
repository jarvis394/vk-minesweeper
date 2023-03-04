import { Cell, CellValue, CellState } from 'src/types/Cell'
import { MouseButton } from 'src/types/MouseButton'

export const isBomb = (cell: Cell) => cell.value === CellValue.BOMB
export const isOpenDisabledForCell = (cell: Cell) =>
  [CellState.FLAGGED, CellState.QUESTIONED].includes(cell.state)

export const isTryingToSetFlag = (e: React.MouseEvent) => {
  const rightClick = e.buttons === MouseButton.RIGHT
  const ctrlClick = e.ctrlKey && e.buttons === MouseButton.LEFT

  return rightClick || ctrlClick
}
