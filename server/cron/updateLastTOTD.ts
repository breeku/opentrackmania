import db from '../models/index.js'
import dotenv from 'dotenv'
dotenv.config()
import { QueryTypes } from 'sequelize'
import { topPlayersMap } from '../modules/leaderboard'
;(async () => {
    const last = await db.Totds.findOne({ order: [['createdAt', 'DESC']], raw: true })
    const success = await topPlayersMap([last.mapUid], false, true)
    success
        ? console.log('Updated last totd leaderboard')
        : console.error('Updating last totd leaderboard failed')

    // track the players from the just updated and closed leaderboard
    const recent = await db.leaderboard_new.findOne({
        where: { mapUid: last.mapUid },
        raw: true,
        order: [['createdAt', 'DESC']],
    })

    const fromDate = new Date(recent.createdAt - 300000).toISOString()
    const toDate = recent.createdAt.toISOString()

    const leaderboard = await db.sequelize.query(
        `
        SELECT *
        FROM  (
            SELECT DISTINCT ON ("accountId") *
            FROM "leaderboard_news"
            WHERE "createdAt" 
            BETWEEN '${fromDate}'
            AND '${toDate}'
            AND "mapUid"='${last.mapUid}'
            ) p
        ORDER BY "updatedAt" DESC;
        `,
        { type: QueryTypes.SELECT },
    )

    const users = []
    for (const data of leaderboard) {
        if (!users.find(x => x === data.accountId)) users.push(data.accountId)
    }

    for (const accountId of users) {
        db.Users.update({ tracking: true }, { where: { accountId } })
    }
})()
