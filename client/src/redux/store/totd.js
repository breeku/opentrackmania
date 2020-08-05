import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'TOTDs',
    initialState: {
        TOTDs: null,
        randomTOTD: null,
    },
    reducers: {
        SET_TOTDs: (state, action) => {
            state.TOTDs = action.payload
        },
        SET_RANDOM_TOTD: (state, action) => {
            state.randomTOTD = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_TOTDs, SET_RANDOM_TOTD } = slice.actions

export const setTOTDs = TOTDs => async dispatch => {
    dispatch(SET_TOTDs(TOTDs))
}

export const setRandomTOTD = TOTD => async dispatch => {
    dispatch(SET_RANDOM_TOTD(TOTD))
}
