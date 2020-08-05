import express from 'express'
import db from '../models/index'
import { Sequelize, fn } from 'sequelize'

export const totdRouter = express.Router()

totdRouter.get('/', async (req, res) => {
    const totds = await db.Totds.findAll({ raw: true })

    const maps = await db.Maps.findAll({
        where: {
            campaign: 'totd',
        },
        raw: true,
    })

    const response = totds.flatMap((totd: any[]) => {
        return maps.flatMap((map: { map: any; data: any }) => {
            if (map.map === totd.map) {
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
            map: totd.map,
        },
        raw: true,
    })

    res.send(map)
})
