import React from 'react'
import { useAppSelector } from 'src/store'
import NumberIndicator from './NumberIndicator'

const FlagsAmount: React.FC = () => {
  const bombsAmount = useAppSelector((state) => state.game.bombs.length)
  const flagsAmount = useAppSelector((state) => state.game.flagsAmount)

  return <NumberIndicator value={bombsAmount - flagsAmount} />
}

export default FlagsAmount
