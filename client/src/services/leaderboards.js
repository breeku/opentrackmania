import axios from 'axios'
import { BASEURL } from "./config"

export const getLeaderboards = async () => {
    const { data } = await axios.get(BASEURL + '/leaderboard')
    return data
}

export const getLeaderboard = async map => {
    const { data } = await axios.get(BASEURL + '/leaderboard/map/' + map)
    return data
}
