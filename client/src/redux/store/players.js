import { createSlice } from '@reduxjs/toolkit'

// Slice
const slice = createSlice({
    name: 'players',
    initialState: {
        players: null,
        player: null,
        playerRanking: null,
    },
    reducers: {
        SET_PLAYERS: (state, action) => {
            state.players = action.payload
        },
        SET_PLAYER: (state, action) => {
            state.player = action.payload
        },
        SET_PLAYER_RANKING: (state, action) => {
            state.playerRanking = action.payload
        },
    },
})
export default slice.reducer

// Actions
const { SET_PLAYERS, SET_PLAYER, SET_PLAYER_RANKING } = slice.actions

export const setPlayers = players => async dispatch => {
    dispatch(SET_PLAYERS(players))
}

export const setPlayer = player => async dispatch => {
    dispatch(SET_PLAYER(player))
}

export const setPlayerRanking = ranking => async dispatch => {
    dispatch(SET_PLAYER_RANKING(ranking))
}
