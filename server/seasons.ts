import db from './models/index.js'
import { getSeasons } from 'trackmania-api-node'
import { saveMaps } from './maps'

import { login } from './login'

export const saveSeasons = async (): Promise<boolean> => {
    const credentials = await login()
    if (credentials) {
        try {
            const seasons = await getSeasons(credentials.nadeoTokens.accessToken)

            for (const season of seasons.campaignList) {
                const {
                    name,
                    seasonUid,
                    leaderboardGroupUid,
                    publishedDate,
                    playlist,
                } = season

                const sFound = await db.Seasons.findOne({
                    where: {
                        seasonUid,
                    },
                    raw: true,
                })

                if (!sFound) {
                    await db.Seasons.create({
                        name,
                        seasonUid,
                        leaderboardGroupUid,
                        publishedDate,
                        playlist,
                    })

                    await saveMaps(playlist, seasonUid, credentials)
                }
            }
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}
