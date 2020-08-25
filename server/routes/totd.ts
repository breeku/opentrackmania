import express from 'express'
import db from '../models/index'
import { QueryTypes, fn } from 'sequelize'

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
    // this can be cached everyday at 17:01 UTC
    const TOTDs = await db.Totds.findAll({
        include: {
            where: { campaign: 'totd' },
            model: db.Maps,
            include: {
                model: db.Users,
            },
        },
    })

    const maps = []
    let top10 = []
    let top1 = []

    const plain = TOTDs.map(record => record.get({ plain: true }))

    for (const { Map } of plain) {
        const mappers = plain.filter(filter => {
            if (filter.Map.User.nameOnPlatform === Map.User.nameOnPlatform) {
                return true
            }
        }).length
        if (mappers > 1) {
            const found = maps.find(x => x.nameOnPlatform === Map.User.nameOnPlatform)

            if (!found) {
                maps.push({
                    nameOnPlatform: Map.User.nameOnPlatform,
                    accountId: Map.User.accountId,
                    count: mappers,
                    tracks: [Map.data],
                })
            } else {
                found.tracks.push(Map.data)
            }
        }
        const leaderboard = await db.sequelize.query(
            `
            SELECT *
            FROM  (
                SELECT DISTINCT ON ("accountId") *
                FROM "leaderboard_news" AS "leaderboard_news" 
                WHERE "mapUid"='${Map.mapUid}'
                ) p
            ORDER BY "updatedAt" DESC;
            `,
            { type: QueryTypes.SELECT },
        )
        if (leaderboard[0].closed) {
            for (let i = 0; i < leaderboard.length; i++) {
                const position = leaderboard[i]
                const user = await db.Users.findOne({
                    where: { accountId: position.accountId },
                    raw: true,
                })
                if (!user) console.log(position.accountId)
                if (i === 0) {
                    // top 1
                    const index = top1.findIndex(
                        x => x.nameOnPlatform === user.nameOnPlatform,
                    )
                    if (index !== -1) {
                        top1[index].count += 1
                    } else {
                        top1.push({
                            nameOnPlatform: user.nameOnPlatform,
                            accountId: user.accountId,
                            count: 1,
                        })
                    }
                }
                // ...rest
                const index = top10.findIndex(
                    x => x.nameOnPlatform === user.nameOnPlatform,
                )
                if (index !== -1) {
                    top10[index].count += 1
                } else {
                    if (position.position <= 10) {
                        top10.push({
                            nameOnPlatform: user.nameOnPlatform,
                            accountId: user.accountId,
                            count: 1,
                        })
                    }
                }
            }
        }
    }
    top10 = top10.sort((a, b) => (a.count < b.count ? 1 : -1)).splice(0, 10)
    top1 = top1.sort((a, b) => (a.count < b.count ? 1 : -1)).splice(0, 10)
    maps.sort((a, b) => (a.count > b.count ? 1 : -1))

    res.send({ maps, top10, top1 })
})
