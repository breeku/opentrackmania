import express from 'express'
import db from '../models/index'
import { topPlayersMap } from '../database/leaderboard'
import { literal } from 'sequelize'

export const leaderboardRouter = express.Router()

leaderboardRouter.get('/', async (req, res) => {
    const leaderboard = await db.Leaderboards.findAll({
        raw: true,
    })
    res.send(leaderboard)
})

leaderboardRouter.get('/map/:id', async (req, res) => {
    const id = req.params.id
    let leaderboard = await db.Leaderboards.findOne({
        where: {
            mapUid: id,
        },
        raw: true,
    })

    if (leaderboard && leaderboard.closed) return res.send(leaderboard)

    const totd = await db.Totds.findOne({ where: { mapUid: id }, raw: true })
    const latest = await db.Totds.findOne({
        order: [
            [literal('year'), 'desc'],
            [literal('month'), 'desc'],
            [literal('day'), 'desc'],
        ],
        raw: true,
    })

    if (!leaderboard) {
        if (totd) {
            if (totd.map === latest.map) {
                await topPlayersMap([id]) // if totd is the latest
            } else {
                await topPlayersMap([id], false, true) // if totd is not the latest, update and close
            }
        } else {
            await topPlayersMap([id])
        }
    } else if (
        !leaderboard.closed &&
        Math.abs(new Date().getTime() - new Date(leaderboard.updatedAt).getTime()) /
            36e5 >
            1
    ) {
        if (totd) {
            if (totd.map === latest.map) {
                await topPlayersMap([id]) // if totd is the latest
            } else if (!leaderboard.closed) {
                await topPlayersMap([id], false, true) // if totd is not the latest and is not closed, update and close
            }
        } else {
            await topPlayersMap([id])
        }
    }

    leaderboard = await db.Leaderboards.findOne({
        where: {
            mapUid: id,
        },
    })

    return res.send(leaderboard)
})
