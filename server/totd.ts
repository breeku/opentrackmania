import db from './models/index.js'
import { getTOTDs, getMaps } from 'trackmania-api-node'

import { login } from './login'

export const saveTOTD = async () => {
    const credentials = await login()
    if (credentials) {
        try {
            const totds = await getTOTDs(credentials.nadeoTokens.accessToken, 0, 2)
            const totd = []
            for (const month of totds.monthList) {
                for (const day of month.days) {
                    const uid = day.mapUid
                    if (uid !== '')
                        totd.push({
                            year: month.year,
                            month: month.month,
                            day: day.monthDay,
                            mapUid: uid,
                        })
                }
            }
            for (const t of totd) {
                if (
                    !(await db.Totds.findOne({
                        where: {
                            mapUid: t.mapUid,
                        },
                        raw: true,
                    }))
                )
                    db.Totds.create(t)
            }
            const mapsToAdd = []

            for (const t of totd) {
                const map = await db.Maps.findOne({
                    where: {
                        mapUid: t.mapUid,
                    },
                    raw: true,
                })
                if (!map) mapsToAdd.push(t.map)
            }

            if (mapsToAdd.length > 0) {
                const maps = await getMaps(credentials.ubiTokens.accessToken, mapsToAdd)
                for (const map of maps) {
                    db.Maps.create({
                        mapId: map.mapId,
                        mapUid: map.mapUid,
                        data: map,
                        campaign: 'totd',
                    })
                }
            }

            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}
