import styled from '@emotion/styled'
import React, { CSSProperties, useMemo } from 'react'

const indicatorStyles: Record<string, CSSProperties> = {}
const SPRITE_INDICATOR_SIZE = 14

Array(10)
  .fill(null)
  .map((_, i) => {
    indicatorStyles['&.Indicator--' + i] = {
      backgroundPositionX:
        i === 0 ? -SPRITE_INDICATOR_SIZE * 9 : -SPRITE_INDICATOR_SIZE * (i - 1),
    }
  })

const Root = styled.div({
  display: 'flex',
  flexDirection: 'row',
})

const Indicator = styled.span({
  background: 'url(./minesweeper-sprites.png)',
  imageRendering: 'pixelated',
  backgroundPositionY: 0,
  width: 13,
  height: 23,
  ...indicatorStyles,
})

type NumberIndicatorProps = {
  value: number
}

const NumberIndicator: React.FC<NumberIndicatorProps> = ({ value }) => {
  const parsedValue = useMemo(() => {
    if (value > 999) return 999
    else if (value < 0) return 0
    else return value
  }, [value])
  const hundreds = (parsedValue - (parsedValue % 100)) / 100
  const tens = ((parsedValue - (parsedValue % 10)) / 10) % 10
  const ones = parsedValue % 10

  return (
    <Root>
      <Indicator className={'Indicator--' + hundreds} />
      <Indicator className={'Indicator--' + tens} />
      <Indicator className={'Indicator--' + ones} />
    </Root>
  )
}

export default React.memo(NumberIndicator)
