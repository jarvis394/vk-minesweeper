import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppSelector } from 'src/store'
import { GameState } from 'src/types/GameState'
import useInterval from 'src/hooks/useInterval'
import NumberIndicator from './NumberIndicator'
import exhaustivnessCheck from 'src/utils/exhaustivnessCheck'

const Timer: React.FC = () => {
  const gameState = useAppSelector((state) => state.game.gameState)
  const [value, setValue] = useState(0)
  const startTime = useRef(Date.now())

  useEffect(() => {
    switch (gameState) {
      case GameState.PLAYING:
        startTime.current = Date.now()
        break
      case GameState.ENDED:
        break
      case GameState.IDLE:
        setValue(0)
        break
      default:
        exhaustivnessCheck(gameState)
    }
  }, [gameState])

  useInterval(
    () => {
      const currentTime = Date.now()
      const diff = (currentTime - startTime.current) / 1000
      setValue(Math.floor(diff))
    },
    gameState === GameState.PLAYING ? 100 : null
  )

  return <NumberIndicator value={value} />
}

export default React.memo(Timer)
