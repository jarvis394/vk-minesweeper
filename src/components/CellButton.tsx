import styled from '@emotion/styled'
import React, { useState, CSSProperties } from 'react'
import cx from 'classnames'
import { Cell, CellState, CellValue } from 'src/types/Cell'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  openCell,
  openMultipleCells,
  pokeCell,
  setFlag,
  openPokedCells,
} from 'src/store/slices/game'
import { objectKeys } from 'ts-extras'
import {
  isBomb,
  isOpenDisabledForCell,
  isTryingToSetFlag,
} from 'src/utils/cell'
import { GameState } from 'src/types/GameState'

const SPRITE_POSITIONS = {
  empty: '-17px -51px',
  poked: '-17px -51px',
  bomb: '-85px -51px',
  closed: '0px -51px',
  flagged: '-34px -51px',
  questioned: '-51px -51px',
  questionedActive: '-68px -51px',
  explodedBomb: '-102px -51px',
  falseFlagged: '-119px -51px',
  1: '0px -68px',
  2: '-17px -68px',
  3: '-34px -68px',
  4: '-51px -68px',
  5: '-68px -68px',
  6: '-85px -68px',
  7: '-102px -68px',
  8: '-119px -68px',
}

const cellStyles: Record<string, CSSProperties> = {}
objectKeys(SPRITE_POSITIONS).forEach((key) => {
  cellStyles['&.Cell--' + key] = {
    backgroundPosition: SPRITE_POSITIONS[key],
  }
})

const Root = styled.button({
  border: '0px solid transparent',
  width: 'var(--spriteCellSizePixels)',
  height: 'var(--spriteCellSizePixels)',
  background: 'url(./minesweeper-sprites.png)',
  backgroundPosition: SPRITE_POSITIONS.closed,
  transform: 'scale(calc(var(--cellSize) / var(--spriteCellSize)))',
  imageRendering: 'pixelated',
  transformOrigin: 'left top',
  cursor: 'pointer',
  padding: 0,
  userSelect: 'none',
  '&:focus-visible': {
    outline: 'red',
    boxShadow: '0 0 0 2px inset rgba(255, 0, 0, 0.75)',
  },
  ...cellStyles,
})

const CellButton: React.FC<{
  cell: Cell
  isPoking: boolean
  setIsPoking: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ cell, isPoking, setIsPoking }) => {
  const dispatch = useAppDispatch()
  const gameState = useAppSelector((state) => state.game.gameState)
  const [isDisabledAfterFlag, setDisabledAfterFlag] = useState<boolean>(false)
  const isDisabled = isOpenDisabledForCell(cell)
  const cellOpenClasses: Record<string, boolean> = {
    'Cell--bomb': isBomb(cell),
    'Cell--explodedBomb': isBomb(cell) && !!cell.isHighlightedAsBomb,
    'Cell--empty': !isBomb(cell) && cell.value === CellValue.EMPTY,
    ['Cell--' + cell.value]: cell.value > CellValue.EMPTY,
  }
  const cellClosedClasses: Record<string, boolean> = {
    'Cell--flagged': cell.state === CellState.FLAGGED,
    'Cell--questioned': cell.state === CellState.QUESTIONED,
    'Cell--poked': cell.state === CellState.POKED,
    'Cell--falseFlagged':
      gameState === GameState.ENDED && !isBomb(cell) && isDisabled,
  }
  const cellClasses =
    cell.state === CellState.OPEN ? cellOpenClasses : cellClosedClasses

  const handleMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isTryingToSetFlag(e)) {
      e.preventDefault()
      setDisabledAfterFlag(true)
      dispatch(setFlag({ cell }))
    } else {
      isDisabledAfterFlag && setDisabledAfterFlag(false)
      setIsPoking(true)
      dispatch(pokeCell({ cell }))
    }
  }

  const handleMouseUp: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isDisabled || isTryingToSetFlag(e) || isDisabledAfterFlag) return

    setIsPoking(false)
    dispatch(pokeCell({ cell, reverse: true }))

    if (cell.value === CellValue.EMPTY) {
      dispatch(openMultipleCells({ cell }))
    } else {
      if (cell.state === CellState.OPEN) dispatch(openPokedCells({ cell }))
      dispatch(openCell({ cell }))
    }
  }

  const handleMouseEnter = () => {
    if (!isDisabled && isPoking) {
      dispatch(pokeCell({ cell }))
    }
  }

  const handleMouseLeave = () => {
    if (!isDisabled && isPoking) {
      dispatch(pokeCell({ cell, reverse: true }))
    }
  }

  const handleRightClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
  }

  return (
    <Root
      className={cx(cellClasses)}
      onContextMenu={handleRightClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}

export default React.memo(CellButton)
