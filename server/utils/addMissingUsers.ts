import db from '../models'
import { createUsers } from '../modules/players'
import { QueryTypes } from 'sequelize'
import { login } from '../modules/login'
;(async () => {
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
    const missingIds = []

    for (const leaderboard of leaderboards) {
        const user = await db.Users.findOne({
            where: { accountId: leaderboard.accountId },
            raw: true,
        })
        if (!user) {
            missingIds.push(leaderboard.accountId)
        }
    }

    if (missingIds.length > 0) {
        const credentials = await login()
        await createUsers(missingIds, credentials)
    } else {
        console.log('No missing users!')
    }
})()
