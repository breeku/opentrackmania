import express from 'express'
import db from '../models/index'
import { topPlayersMap } from '../modules/leaderboard'
import { literal, Op, QueryTypes } from 'sequelize'

export const leaderboardRouter = express.Router()

leaderboardRouter.get('/map/:id', async (req, res) => {
    const id = req.params.id
    const recent = await db.leaderboard_new.findOne({
        where: { mapUid: id },
        raw: true,
        order: [['createdAt', 'DESC']],
    })

    if (!recent) return res.send(null)

    const fromDate = new Date(recent.createdAt - 300000).toISOString()
    const toDate = recent.createdAt.toISOString()

    let leaderboard = await db.sequelize.query(
        `
        SELECT *
        FROM  (
            SELECT DISTINCT ON ("accountId") *
            FROM "leaderboard_news"
            WHERE "createdAt" 
            BETWEEN '${fromDate}'
            AND '${toDate}'
            AND "mapUid"='${id}'
            ) p
        ORDER BY "updatedAt" DESC;
        `,
        { type: QueryTypes.SELECT },
    )

    // 1. if leaderboard exists and is closed, return it
    // 2. if leaderboard doesn't exist, get leaderboard
    // 2.1 if we're looking for totd, check if it is the today's totd
    // 2.2 in case it is, get it
    // 2.3 in case if it is not, get it and close it
    // 3. update if leaderboard exists, is not closed and it's been a hour since it's been updated
    // 3.1 and do the same check's for totd.
    // TODO: make topPlayersMap return the leaderboard

    if (leaderboard[0] && leaderboard[0].closed) {
        const accountIds = leaderboard.map(x => x.accountId)
        const users = await db.Users.findAll({
            where: { accountId: { [Op.in]: accountIds } },
            raw: true,
        })
        const result = leaderboard
            .map(x => {
                return { ...x, user: users.find(u => u.accountId === x.accountId) }
            })
            .sort((a, b) => (a.position > b.position ? 1 : -1))

        return res.send(result)
    }

    const totd = await db.Totds.findOne({ where: { mapUid: id }, raw: true })
    const latest = await db.Totds.findOne({
        order: [
            [literal('year'), 'desc'],
            [literal('month'), 'desc'],
            [literal('day'), 'desc'],
        ],
        raw: true,
    })

    if (!leaderboard[0]) {
        if (totd) {
            if (totd.mapUid === latest.mapUid) {
                await topPlayersMap([id]) // if totd is the latest
            } else {
                await topPlayersMap([id], false, true) // if totd is not the latest, update and close
            }
        } else {
            await topPlayersMap([id])
        }
    } else if (
        !leaderboard[0].closed &&
        Math.abs(new Date().getTime() - new Date(leaderboard[0].updatedAt).getTime()) /
            36e5 >
            0.25
    ) {
        if (totd) {
            if (totd.mapUid === latest.mapUid) {
                await topPlayersMap([id]) // if totd is the latest
            } else if (!leaderboard[0].closed) {
                await topPlayersMap([id], false, true) // if totd is not the latest and is not closed, update and close
            }
        } else {
            await topPlayersMap([id])
        }
    }

    leaderboard = await db.sequelize.query(
        `
        SELECT *
        FROM  (
            SELECT DISTINCT ON ("accountId") *
            FROM "leaderboard_news"
            WHERE "createdAt" 
            BETWEEN '${fromDate}'
            AND '${toDate}'
            AND "mapUid"='${id}'
            ) p
        ORDER BY "updatedAt" DESC;
        `,
        { type: QueryTypes.SELECT },
    )
    const accountIds = leaderboard.map(x => x.accountId)
    const users = await db.Users.findAll({
        where: { accountId: { [Op.in]: accountIds } },
        raw: true,
    })
    const result = leaderboard
        .map(x => {
            return { ...x, user: users.find(u => u.accountId === x.accountId) }
        })
        .sort((a, b) => (a.position > b.position ? 1 : -1))

    return res.send(result)
})
