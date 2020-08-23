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

    // track the players from the just updated and closed leaderboard
    const leaderboard = await db.Leaderboards.findOne({
        where: { mapUid: last.mapUid },
        raw: true,
    })

    const users = []
    for (const data of leaderboard.data) {
        if (!users.find(x => x === data.accountId)) users.push(data.accountId)
    }

    for (const accountId of users) {
        db.Users.update({ tracking: true }, { where: { accountId } })
    }
})()
