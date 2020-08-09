import dotenv from 'dotenv'
dotenv.config()
import { updateRankings } from './server/players'
;(async () => {
    const success = await updateRankings()
    success ? console.log('Updated rankings') : console.error('Updating rankings failed')
})()
