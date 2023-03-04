import styled from '@emotion/styled'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import CellButton from './components/CellButton'
import { useAppDispatch, useAppSelector } from './store'
import { generateCells } from './store/slices/game'
import { MouseButton } from './types/MouseButton'

const Root = styled.div({
  width: 'fit-content',
})

const Row = styled.div({
  display: 'flex',
})

const App = () => {
  const $field = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const fieldSize = useAppSelector((state) => state.game.size)
  const cells = useAppSelector((state) => state.game.cells)
  const [isPoking, setIsPoking] = useState(false)

  useLayoutEffect(() => {
    dispatch(generateCells())
  }, [])

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

  return (
    <Root ref={$field}>
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
    </Root>
  )
}

export default App
