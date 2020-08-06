import db from './models/index.js'
import { getSeasons, getMaps } from 'trackmania-api-node'

import { login } from './login'

export const saveSeasons = async () => {
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

                    const mapsToAdd = []

                    for (const p of playlist) {
                        const map = await db.Maps.findOne({
                            where: {
                                mapUid: p.mapUid,
                            },
                            raw: true,
                        })
                        if (!map) mapsToAdd.push(p.mapUid)
                    }

                    if (mapsToAdd.length > 0) {
                        const maps = await getMaps(
                            credentials.ubiTokens.accessToken,
                            mapsToAdd,
                        )
                        for (const map of maps) {
                            db.Maps.create({
                                mapId: map.mapId,
                                mapUid: map.mapUid,
                                data: map,
                                campaign: seasonUid,
                            })
                        }
                    }
                }
            }
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}
