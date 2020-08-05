import axios from 'axios'

export const getLeaderboards = async () => {
    const { data } = await axios.get('/api/leaderboard')
    return data
}

export const getLeaderboard = async map => {
    const { data } = await axios.get('/api/leaderboard/map/' + map)
    return data
}
