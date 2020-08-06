import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'seasons',
    initialState: {
        seasons: null,
    },
    reducers: {
        SET_SEASONS: (state, action) => {
            state.seasons = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_SEASONS } = slice.actions

export const setSeasons = seasons => async dispatch => {
    dispatch(SET_SEASONS(seasons))
}
