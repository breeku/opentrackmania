import express from 'express'
import db from '../models/index'
import { Op, fn } from 'sequelize'

export const totdRouter = express.Router()

totdRouter.get('/', async (req, res) => {
    const totds = await db.Totds.findAll({ raw: true })

    const maps = await db.Maps.findAll({
        where: {
            campaign: 'totd',
        },
        raw: true,
    })
    const response = totds.flatMap(totd => {
        return maps.flatMap((map: { mapUid: any; data: any }) => {
            if (map.mapUid === totd.mapUid) {
                return { ...totd, map: map.data }
            } else {
                return []
            }
        })
    })
    res.send(response)
})

totdRouter.get('/random', async (req, res) => {
    const totd = await db.Totds.findOne({
        order: fn('random'),
        raw: true,
    })

    const map = await db.Maps.findOne({
        where: {
            mapUid: totd.mapUid,
        },
        raw: true,
    })

    res.send(map)
})

totdRouter.get('/stats', async (req, res) => {
    const TOTDs = await db.Totds.findAll({
        include: {
            include: { all: true, nested: true }, // bad, couldnt do array of models. probably model associations are wrong?
            where: { campaign: 'totd' },
            model: db.Maps,
        },
    })

    const maps = []

    const plain = TOTDs.map(record => record.get({ plain: true }))

    for (const { Map } of plain) {
        const mappers = plain.filter(
            filter => filter.Map.User.nameOnPlatform === Map.User.nameOnPlatform,
        ).length
        if (mappers > 1) {
            const found = maps.find(x => x.nameOnPlatform === Map.User.nameOnPlatform)

            if (!found) {
                maps.push({
                    nameOnPlatform: Map.User.nameOnPlatform,
                    count: mappers,
                    tracks: [Map.data],
                })
            } else {
                found.tracks.push(Map.data)
            }
        }
    }

    maps.sort((a, b) => (a.count > b.count ? 1 : -1))
    res.send({ maps })
})
