import db from '../models/index.js'
import { getTOTDs } from 'trackmania-api-node'
import { saveMaps } from './maps'

import { login } from './login'

export const saveTOTD = async (): Promise<boolean> => {
    const credentials = await login()
    if (credentials) {
        try {
            const totds = await getTOTDs(credentials.nadeoTokens.accessToken, 0, 1)
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
                            seasonUid: day.seasonUid,
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
                    await db.Totds.create(t)
                await saveMaps([t], 'totd', t.seasonUid, credentials) // should split the totd array with seasonuids so we could pass all map ids at once
            }

            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}
