import express from 'express'
import db from '../models/index'

export const trackRouter = express.Router()

trackRouter.get('/:id', async (req, res) => {
    const id = req.params.id

    const track = await db.Maps.findOne({
        where: {
            map: id,
        },
        raw: true,
    })

    res.send(track)
})
