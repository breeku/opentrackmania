import db from '../models/index.js'
import dotenv from 'dotenv'
dotenv.config()
import { topPlayersMap } from '../modules/leaderboard'
;(async () => {
    const last = await db.Totds.findOne({ order: [['createdAt', 'DESC']], raw: true })
    const success = await topPlayersMap([last.mapUid], false, true)
    success
        ? console.log('Updated last totd leaderboard')
        : console.error('Updating last totd leaderboard failed')
})()
