import styled from '@emotion/styled'
import React from 'react'
import Game from './components/Game'

const Root = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#b6b9bc',
})

const App: React.FC = () => {
  return (
    <Root>
      <Game />
    </Root>
  )
}

export default App
