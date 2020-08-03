import axios from 'axios'

export const getTOTDs = async () => {
    const { data } = await axios.get('/api/totds')
    return data
}
