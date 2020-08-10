import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import tracks from './tracks'
import totd from './totd'
import seasons from './seasons'
import players from './players'

const reducer = combineReducers({
    tracks,
    totd,
    seasons,
    players,
})

const store = configureStore({
    reducer,
})

export default store
