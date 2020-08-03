import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'tracks',
    initialState: {
        track: null,
    },
    reducers: {
        SET_TRACK: (state, action) => {
            state.track = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_TRACK } = slice.actions

export const setTrack = track => async dispatch => {
    dispatch(SET_TRACK(track))
}
