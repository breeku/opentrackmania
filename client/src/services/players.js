import axios from 'axios'

export const getPlayers = async () => {
    const { data } = await axios.get('/api/players/')
    return data
}
