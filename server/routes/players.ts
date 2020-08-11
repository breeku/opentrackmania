import express from 'express'
import db from '../models/index'
import { Op } from 'sequelize'
import { saveTrophies } from '../players'

export const playerRouter = express.Router()

playerRouter.get('/rankings/', async (req, res) => {
    const users = await db.Users.findAll({
        raw: true,
    })

    const recent = await db.Rankings.findOne({
        raw: true,
        order: [['createdAt', 'DESC']],
    })

    if (!recent) return res.send(null)

    const rankings = await db.Rankings.findAll({
        raw: true,
        where: {
            createdAt: {
                [Op.lte]: recent.createdAt,
                [Op.gte]: new Date(recent.createdAt - 23.99 * 3600 * 1000).toISOString(),
            },
        },
        order: [['countPoint', 'DESC']],
    })

    const response = []

    for (const ranking of rankings) {
        // split into correct zones, 1 / 2 / 3 / 4
        const { nameOnPlatform, accountId } = users.find(
            (x: { accountId: any }) => x.accountId === ranking.accountId,
        )
        for (const zone of ranking.zones) {
            const { zoneName } = zone
            if (
                !response.find(x => {
                    if (x.zoneName === zoneName) {
                        return true
                    }
                })
            )
                response.push({ zoneName, players: [] })

            const z = response.find(x => x.zoneName === zone.zoneName)
            z.players.push({
                echelon: ranking.echelon,
                points: ranking.countPoint,
                position: zone.ranking.position,
                accountId,
                nameOnPlatform,
            })
        }
    }
    res.send(response)
})

playerRouter.get('/rankings/:id', async (req, res) => {
    const id = req.params.id
    const rankings = await db.Rankings.findAll({
        raw: true,
        where: {
            accountId: id,
        },
        order: [['createdAt', 'DESC']],
    })
    if (rankings.length === 0) return res.send(null)
    res.send(rankings)
})

playerRouter.get('/trophies/:id', async (req, res) => {
    const id = req.params.id

    const user = await db.Users.findOne({
        where: {
            accountId: id,
        },
        raw: true,
    })

    let trophies = await db.Trophies.findOne({
        where: {
            accountId: user.accountId,
        },
        raw: true,
    })

    if (!trophies) {
        trophies = await saveTrophies(id, false, 'CREATE')
    } else {
        // if trophies are 24h old, get them again
        if (
            Math.abs(new Date().getTime() - new Date(trophies.updatedAt).getTime()) /
                36e5 >
            24
        ) {
            trophies = await saveTrophies(id, false, 'UPDATE')
        }
    }

    res.send(trophies)
})

playerRouter.get('/:id', async (req, res) => {
    const id = req.params.id

    const { accountId, nameOnPlatform } = await db.Users.findOne({
        raw: true,
        where: {
            accountId: id,
        },
    })

    res.send({ accountId, nameOnPlatform })
})
