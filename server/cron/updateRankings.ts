import db from '../models/index.js'
import { Op, QueryTypes } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()
import { updateRankings } from '../modules/players'
;(async () => {
    // first track players who are not tracked but have top 100 record in any seasonal track, totd leaderboard players are tracked when closed
    // todo: move this to leaderboard update...

    const leaderboards = await db.sequelize.query(
        `
        SELECT *
        FROM  (
            SELECT DISTINCT ON ("accountId") *
            FROM "leaderboard_news" AS "leaderboard_news" 
            ) p
        ORDER BY "updatedAt" DESC;
        `,
        { type: QueryTypes.SELECT },
    )

    const maps = await db.Maps.findAll({
        where: { campaign: { [Op.ne]: 'totd' } },
        raw: true,
    })

    const filtered = leaderboards.filter(x => maps.find(m => x.mapUid === m.mapUid))

    const users = []
    for (const leaderboard of filtered) {
        for (const data of leaderboard.data) {
            if (!users.find(x => x === data.accountId)) users.push(data.accountId)
        }
    }

    for (const accountId of users) {
        db.Users.update({ tracking: true }, { where: { accountId } })
    }

    const success = await updateRankings()
    success ? console.log('Updated rankings') : console.error('Updating rankings failed')
})()
