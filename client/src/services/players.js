import axios from 'axios'

export const getPlayerRankings = async () => {
    const { data } = await axios.get('/api/players/rankings')
    return data
}

export const getPlayerRanking = async id => {
    const { data } = await axios.get('/api/players/rankings/' + id)
    return data
}

export const getPlayer = async id => {
    const { data } = await axios.get('/api/players/' + id)
    return data
}

export const getPlayerTrophies = async id => {
    const { data } = await axios.get('/api/players/trophies/' + id)
    return data
}

export const searchPlayer = async name => {
    const { data } = await axios.get('/api/players/search/' + name)
    return data
}
