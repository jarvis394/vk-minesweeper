import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { useAppSelector } from 'src/store'
import NumberIndicator from './NumberIndicator'

const Root = styled.div({
  display: 'flex',
  flexDirection: 'row',
})

const FlagsAmount: React.FC = () => {
  const bombsAmount = useAppSelector((state) => state.game.bombs.length)
  const flagsAmount = useAppSelector((state) => state.game.flagsAmount)

  return <NumberIndicator value={bombsAmount - flagsAmount} />
}

export default FlagsAmount
