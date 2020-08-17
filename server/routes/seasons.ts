import express from 'express'
import db from '../models/index'

export const seasonRouter = express.Router()

seasonRouter.get('/', async (req, res) => {
    const response = []
    const seasons = await db.Seasons.findAll({
        raw: true,
    })

    for (const season of seasons) {
        const { playlist } = season

        const maps = await db.Maps.findAll({
            where: {
                campaign: season.name,
            },
            raw: true,
        })
        const seasonMaps = playlist.flatMap((track: { mapUid: any }) => {
            return maps.flatMap((map: { mapUid: any; data: any }) => {
                if (map.mapUid === track.mapUid) {
                    return { ...track, map: map.data }
                } else {
                    return []
                }
            })
        })

        response.push({ ...season, playlist: seasonMaps })
    }
    res.send(response)
})
