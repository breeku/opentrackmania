import express from 'express'
import db from '../models/index'
import { fn } from 'sequelize'

export const totdRouter = express.Router()

totdRouter.get('/', async (req, res) => {
    const totds = await db.Totds.findAll({ raw: true })

    const maps = await db.Maps.findAll({
        where: {
            campaign: 'totd',
        },
        raw: true,
    })
    console.log(maps.length)
    const response = totds.flatMap(totd => {
        return maps.flatMap((map: { mapUid: any; data: any }) => {
            if (map.mapUid === totd.mapUid) {
                return { ...totd, map: map.data }
            } else {
                return []
            }
        })
    })
    console.log(response.length)
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
