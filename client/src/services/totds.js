import axios from 'axios'
import { BASEURL } from "./config"

export const getTOTDs = async () => {
    const { data } = await axios.get(BASEURL + '/totds')
    return data
}

export const getRandomTOTD = async () => {
    const { data } = await axios.get(BASEURL + '/totds/random')
    return data
}

export const getTOTDStats = async () => {
    const { data } = await axios.get(BASEURL + '/totds/stats')
    return data
}