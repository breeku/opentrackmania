import axios from 'axios'
import { BASEURL } from "./config"

export const getTrack = async id => {
    const { data } = await axios.get(BASEURL + '/tracks/' + id)
    return data
}
