import db from '../models'
import { QueryTypes } from 'sequelize'
;(async () => {
    const leaderboards = await db.sequelize.query(
        `
        SELECT *
        FROM  (
            SELECT DISTINCT ON ("mapUid") *
            FROM "Leaderboards" AS "Leaderboards" 
            ) p
        ORDER BY "updatedAt" DESC;
        `,
        { type: QueryTypes.SELECT },
    )

    for (const leaderboard of leaderboards) {
        for (const data of leaderboard.data) {
            await db.leaderboard_new.create({
                mapUid: leaderboard.mapUid,
                accountId: data.accountId,
                closed: leaderboard.closed,
                score: data.score,
                position: data.position,
                ghost: data.ghost,
                createdAt: leaderboard.createdAt,
            })
        }
    }
})()
