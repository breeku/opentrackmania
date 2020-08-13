import axios from 'axios'
import { BASEURL } from "./config"

export const getSeasons = async () => {
    const { data } = await axios.get(BASEURL + '/seasons/')
    return data
}
