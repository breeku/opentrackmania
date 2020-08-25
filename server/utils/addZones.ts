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
        for (let i = 0; i < ranking.zones.length; i++) {
            const { zoneId, zoneName } = ranking.zones[i]
            const found = await db.zones.findOne({ where: { zoneId } })
            if (!found) {
                await db.zones.create({ zoneId, zoneName, tier: i })
            }
        }
    }
})()
