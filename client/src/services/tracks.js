import axios from 'axios'

export const getTrack = async id => {
    const { data } = await axios.get('/api/tracks/' + id)
    return data
}
