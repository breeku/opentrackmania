import axios from 'axios'

export const getTOTDs = async () => {
    const { data } = await axios.get('/api/totds')
    return data
}

export const getRandomTOTD = async () => {
    const { data } = await axios.get('/api/totds/random')
    return data
}
