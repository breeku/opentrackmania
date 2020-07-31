import axios from 'axios'

export const getLeaderboards = async () => {
    const { data } = await axios.get('/api/leaderboard')
    return data
}
