import express from 'express'
import db from '../models/index'

export const seasonRouter = express.Router()

seasonRouter.get('/', async (req, res) => {
    const response = []
    const seasons = await db.Seasons.findAll({
        raw: true,
    })

    for (const season of seasons) {
        const { name, seasonUid, leaderboardGroupUid, publishedDate, playlist } = season

        const maps = await db.Maps.findAll({
            where: {
                campaign: season.seasonUid,
            },
            raw: true,
        })

        const seasonMaps = playlist.flatMap((track: { mapUid: any }) => {
            return maps.flatMap((map: { map: any; data: any }) => {
                if (map.map === track.mapUid) {
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
