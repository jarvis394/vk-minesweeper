import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import gameReducer from './slices/game'

const rootReducer = combineReducers({
  game: gameReducer,
})

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
})

export default store

export type RootDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>

type DispatchFunc = () => RootDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
