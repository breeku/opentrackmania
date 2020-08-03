import dotenv from 'dotenv'
dotenv.config()
import { topPlayersFromSeasons } from './server/leaderboard'
;(async () => {
    const success = await topPlayersFromSeasons()
    success
        ? console.log('Updated leaderboards')
        : console.error('Updating leaderboards failed')
})()
