import db from './models/index.js'
import { getTOTDs } from 'trackmania-api-node'
import { saveMaps } from './maps'

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

            await saveMaps(totd, 'totd', credentials)

            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}
