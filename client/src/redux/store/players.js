import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'players',
    initialState: {
        players: null,
        player: null,
    },
    reducers: {
        SET_PLAYERS: (state, action) => {
            state.players = action.payload
        },
        SET_PLAYER: (state, action) => {
            state.player = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_PLAYERS, SET_PLAYER } = slice.actions

export const setPlayers = players => async dispatch => {
    dispatch(SET_PLAYERS(players))
}

export const setPlayer = player => async dispatch => {
    dispatch(SET_PLAYER(player))
}
