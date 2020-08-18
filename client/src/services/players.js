import axios from 'axios'
import { BASEURL } from './config'

export const getPlayerRankings = async () => {
    const { data } = await axios.get(BASEURL + '/players/rankings')
    return data
}

export const getPlayerRanking = async id => {
    const { data } = await axios.get(BASEURL + '/players/rankings/' + id)
    return data
}

export const getPlayer = async id => {
    const { data } = await axios.get(BASEURL + '/players/' + id)
    return data
}

export const getPlayerTrophies = async id => {
    const { data } = await axios.get(BASEURL + '/players/trophies/' + id)
    return data
}

export const searchPlayer = async name => {
    const { data } = await axios.get(BASEURL + '/players/search/' + name)
    return data
}

export const getPlayerRecords = async id => {
    const { data } = await axios.get(BASEURL + '/players/records/' + id)
    return data
}
