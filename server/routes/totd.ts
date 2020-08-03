import express from 'express'
import db from '../models/index'

export const totdRouter = express.Router()

totdRouter.get('/', async (req, res) => {
    const maps = []
    const totds = await db.Totds.findAll({ raw: true })

    for (const item of totds) {
        maps.push(
            await db.Maps.findOne({
                where: {
                    map: item.map,
                },
                raw: true,
            }),
        )
    }

    const response = totds.flatMap(totd => {
        return maps.flatMap(map => {
            if (map.map === totd.map) {
                return { ...totd, map: map.data }
            } else {
                return []
            }
        })
    })

    res.send(response)
})
