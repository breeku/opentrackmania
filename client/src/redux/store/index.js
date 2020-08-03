import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import tracks from './tracks'
import totd from './totd'

const reducer = combineReducers({
    tracks,
    totd,
})

const store = configureStore({
    reducer,
})

export default store
