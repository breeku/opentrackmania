import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'players',
    initialState: {
        players: null,
    },
    reducers: {
        SET_PLAYERS: (state, action) => {
            state.players = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_PLAYERS } = slice.actions

export const setPlayers = players => async dispatch => {
    dispatch(SET_PLAYERS(players))
}
