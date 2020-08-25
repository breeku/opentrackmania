import db from '../models/index.js'
import { getMaps } from 'trackmania-api-node'
import { createUsers } from './players'

export const saveMaps = async (
    maps: any[],
    campaign: string,
    seasonUid: string,
    credentials: {
        ticket: string
        ubiTokens: any
        nadeoTokens: any
        accountId?: string
    },
): Promise<void> => {
    try {
        const mapsToAdd = []

        for (const m of maps) {
            const map = await db.Maps.findOne({
                where: {
                    mapUid: m.mapUid,
                },
                raw: true,
            })
            if (!map) mapsToAdd.push(m.mapUid)
        }

        if (mapsToAdd.length > 0) {
            const maps = await getMaps(credentials.ubiTokens.accessToken, mapsToAdd)
            for (const map of maps) {
                await db.Maps.create({
                    mapId: map.mapId,
                    mapUid: map.mapUid,
                    accountId: map.author,
                    data: map,
                    campaign,
                    seasonUid,
                })
                const user = await db.Users.findOne({
                    where: {
                        accountId: map.author,
                    },
                    raw: true,
                })
                if (!user) await createUsers([map.author], credentials)
            }
        }
    } catch (e) {
        console.error(e)
    }
}
