import db from '../models'
import { QueryTypes } from 'sequelize'
;(async () => {
    const rankings = await db.sequelize.query(
        `
        SELECT *
        FROM  (
            SELECT DISTINCT ON ("accountId") *
            FROM "Rankings" AS "Rankings" 
            ) p
        ORDER BY "countPoint" DESC;
        `,
        { type: QueryTypes.SELECT },
    )
    for (const ranking of rankings) {
        const zones = ranking.zones.slice(1).map(z => {
            return { zoneName: z.zoneName, zoneId: z.zoneId }
        })
        await db.Users.update({ zones }, { where: { accountId: ranking.accountId } })
    }
})()
