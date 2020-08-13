import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'search',
    initialState: {
        results: null,
    },
    reducers: {
        SET_SEARCH_RESULTS: (state, action) => {
            state.results = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_SEARCH_RESULTS } = slice.actions

export const setSearchResults = results => async dispatch => {
    dispatch(SET_SEARCH_RESULTS(results))
}
