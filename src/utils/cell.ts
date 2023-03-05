import { Cell, CellValue, CellState } from 'src/types/Cell'
import { MouseButton } from 'src/types/MouseButton'

export const isBomb = (cell: Cell) => cell.value === CellValue.BOMB
export const isOpenDisabledForCell = (cell: Cell) =>
  [CellState.FLAGGED, CellState.QUESTIONED].includes(cell.state)

export const isTryingToSetFlag = (e: React.MouseEvent) => {
  const checkClick = (event: React.MouseEvent, button: number) =>
    event.button === button || event.buttons === button
  const rightClick = checkClick(e, MouseButton.RIGHT)
  const ctrlClick = e.ctrlKey && checkClick(e, MouseButton.LEFT)

  return rightClick || ctrlClick
}
