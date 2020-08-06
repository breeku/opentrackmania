import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import tracks from './tracks'
import totd from './totd'
import seasons from './seasons'

const reducer = combineReducers({
    tracks,
    totd,
    seasons,
})

const store = configureStore({
    reducer,
})

export default store
