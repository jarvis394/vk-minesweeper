import styled from '@emotion/styled'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SPRITE_CELL_SIZE, CELL_SIZE, CELL_SIZES } from 'src/config/constants'
import { useAppDispatch, useAppSelector } from 'src/store'
import { generateCells } from 'src/store/slices/game'
import { MouseButton } from 'src/types/MouseButton'
import CellButton from './CellButton'
import FlagsAmount from './FlagsAmount'
import Smile from './Smile'
import Timer from './Timer'

const Wrapper = styled('div', {
  shouldForwardProp: (p) => !['cellSize', 'fieldSize'].includes(p),
})<{
  cellSize: number
  fieldSize: number
}>(({ cellSize, fieldSize }) => ({
  width: 'fit-content',
  '--spriteCellSizePixels': SPRITE_CELL_SIZE + 'px',
  '--spriteCellSize': SPRITE_CELL_SIZE,
  '--cellSizePixels': cellSize + 'px',
  '--cellSize': cellSize,
  '--fieldSize': fieldSize,
}))

const GameContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 6,
  borderWidth: 2,
  borderStyle: 'solid',
  borderLeftColor: '#fff',
  borderTopColor: '#fff',
  borderRightColor: '#9b9b9b',
  borderBottomColor: '#9b9b9b',
  backgroundColor: '#c2c2c2',
})

const BorderedContainer = styled.div({
  borderWidth: 2,
  borderStyle: 'solid',
  borderLeftColor: '#7b7b7b',
  borderTopColor: '#7b7b7b',
  borderRightColor: '#fff',
  borderBottomColor: '#fff',
})

const Header = styled(BorderedContainer)({
  padding: 6,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const Row = styled.div({
  display: 'grid',
  grid: 'repeat(1, var(--cellSizePixels)) / repeat(var(--fieldSize), var(--cellSizePixels))',
})

const Game: React.FC = () => {
  const dispatch = useAppDispatch()
  const fieldSize = useAppSelector((state) => state.game.size)
  const cells = useAppSelector((state) => state.game.cells)
  const [isPoking, setIsPoking] = useState(false)
  const [isMouseInsideField, setIsMouseInsideField] = useState(false)
  const [cellSize, setCellSize] = useState(CELL_SIZE)
  const $field = useRef<HTMLDivElement>(null)

  const handleCellSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCellSize = Number(e.currentTarget.value)
    setCellSize(newCellSize)
  }

  useLayoutEffect(() => {
    dispatch(generateCells())
  }, [dispatch])

  // Handle poking events outside of the field
  useEffect(() => {
    const handleMouseUp = () => setIsPoking(false)
    const handleMouseDown = (e: MouseEvent) => {
      if (e.buttons === MouseButton.LEFT) {
        setIsPoking(true)
      }
    }

    document.body.addEventListener('mousedown', handleMouseDown)
    document.body.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.body.removeEventListener('mousedown', handleMouseDown)
      document.body.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cells, fieldSize])

  // Remembers mouse position relative to the field
  useEffect(() => {
    const fieldRef = $field.current
    const handleMouseEnter = () => setIsMouseInsideField(true)
    const handleMouseLeave = () => {
      setIsMouseInsideField(false)
    }

    fieldRef?.addEventListener('mouseenter', handleMouseEnter)
    fieldRef?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      fieldRef?.removeEventListener('mouseenter', handleMouseEnter)
      fieldRef?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cells, fieldSize])

  return (
    <Wrapper fieldSize={fieldSize} cellSize={cellSize}>
      <GameContainer>
        <Header>
          <FlagsAmount />
          <Smile isPoking={isMouseInsideField && isPoking} />
          <Timer />
        </Header>
        <BorderedContainer ref={$field}>
          {cells.map((col, i) => (
            <Row key={i}>
              {col.map((cell) => (
                <CellButton
                  isPoking={isPoking}
                  setIsPoking={setIsPoking}
                  cell={cell}
                  key={`${cell.x}_${cell.y}`}
                />
              ))}
            </Row>
          ))}
        </BorderedContainer>
      </GameContainer>
      <select onChange={handleCellSizeChange}>
        {CELL_SIZES.map((size, i) => (
          <option key={i}>{size}</option>
        ))}
      </select>
    </Wrapper>
  )
}

export default React.memo(Game)
