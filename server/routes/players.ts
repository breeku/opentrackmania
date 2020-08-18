import express from 'express'
import db from '../models/index'
import { QueryTypes, Op } from 'sequelize'
import { saveTrophies } from '../modules/players'

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

    const fromDate = new Date(recent.createdAt - 23.9 * 3600 * 1000).toISOString()
    const toDate = recent.createdAt.toISOString()
    const rankings = await db.sequelize.query(
        `
        SELECT *
        FROM  (
            SELECT DISTINCT ON ("accountId") *
            FROM "Rankings" AS "Rankings" 
            WHERE "Rankings"."createdAt" 
            BETWEEN '${fromDate}'
            AND '${toDate}'
            ) p
        ORDER BY "countPoint" DESC;
        `,
        { type: QueryTypes.SELECT },
    )

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
        order: [['createdAt', 'ASC']],
    })
    if (rankings.length === 0) return res.send(null)
    res.send(rankings)
})

playerRouter.get('/trophies/:id', async (req, res) => {
    const id = req.params.id

    let trophies = await db.Trophies.findOne({
        where: {
            accountId: id,
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

    const user = await db.Users.findOne({
        raw: true,
        where: {
            accountId: id,
        },
        attributes: ['accountId', 'nameOnPlatform'],
    })

    res.send(user)
})

playerRouter.get('/search/:name', async (req, res) => {
    const name = req.params.name

    const users = await db.Users.findAll({
        raw: true,
        where: {
            nameOnPlatform: {
                [Op.iLike]: '%' + name + '%',
            },
        },
        limit: 10,
        attributes: ['accountId', 'nameOnPlatform'],
    })

    res.send(users)
})

playerRouter.get('/records/:id', async (req, res) => {
    const id = req.params.id

    const records = await db.Leaderboards.findAll({
        where: {
            data: {
                [Op.contains]: [{ accountId: id }],
            },
        },
        include: {
            model: db.Maps,
        },
        raw: true,
    })

    const filtered = records.map((record: { data: any[] }) => {
        return { ...record, data: record.data.filter(x => x.accountId === id)[0] }
    })

    res.send(filtered)
})
