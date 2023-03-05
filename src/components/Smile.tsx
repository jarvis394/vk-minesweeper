import styled from '@emotion/styled'
import React, { CSSProperties } from 'react'
import { objectKeys } from 'ts-extras'
import cx from 'classnames'
import { useAppDispatch, useAppSelector } from 'src/store'
import { GameResult } from 'src/types/GameResult'
import { generateCells } from 'src/store/slices/game'

const SPRITE_POSITIONS = {
  default: 0,
  defaultPressed: -27,
  poking: -54,
  won: -81,
  lost: -108,
}

const smileStyles: Record<string, CSSProperties> = {}
objectKeys(SPRITE_POSITIONS).forEach((key) => {
  smileStyles['&.SmileImage--' + key] = {
    backgroundPositionX: SPRITE_POSITIONS[key],
  }
})

const SmileImage = styled.div({
  background: 'url(./minesweeper-sprites.png)',
  imageRendering: 'pixelated',
  backgroundPositionY: -24,
  width: 26,
  height: 26,
  backgroundPositionX: SPRITE_POSITIONS.default,
  '&:active': {
    backgroundPositionX: SPRITE_POSITIONS.defaultPressed,
  },
  ...smileStyles,
})

type SmileProps = {
  isPoking: boolean
}

const Smile: React.FC<SmileProps> = ({ isPoking }) => {
  const dispatch = useAppDispatch()
  const gameResult = useAppSelector((state) => state.game.gameResult)
  const className = cx({
    'SmileImage--won': gameResult === GameResult.WON,
    'SmileImage--lost': gameResult === GameResult.LOST,
    'SmileImage--poking': isPoking,
  })

  const handleClick = () => {
    dispatch(generateCells())
  }

  return <SmileImage onClick={handleClick} className={className} />
}

export default Smile
