import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'TOTDs',
    initialState: {
        TOTDs: null,
    },
    reducers: {
        SET_TOTDs: (state, action) => {
            state.TOTDs = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_TOTDs } = slice.actions

export const setTOTDs = TOTDs => async dispatch => {
    dispatch(SET_TOTDs(TOTDs))
}
