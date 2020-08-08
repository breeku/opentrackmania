import db from './models/index.js'
import { getMaps } from 'trackmania-api-node'

export const saveMaps = async (
    maps: any[],
    campaign: string,
    credentials: {
        ticket?: string
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
                db.Maps.create({
                    mapId: map.mapId,
                    mapUid: map.mapUid,
                    data: map,
                    campaign,
                })
            }
        }
    } catch (e) {
        console.error(e)
    }
}
