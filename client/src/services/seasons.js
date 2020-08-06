import axios from 'axios'

export const getSeasons = async () => {
    const { data } = await axios.get('/api/seasons/')
    return data
}
