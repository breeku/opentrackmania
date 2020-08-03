import express from 'express'
import db from '../models/index'

export const leaderboardRouter = express.Router()

leaderboardRouter.get('/', async (req, res) => {
    const leaderboard = await db.Leaderboards.findAll({
        raw: true,
    })
    res.send(leaderboard)
})
