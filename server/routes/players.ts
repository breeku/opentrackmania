import express from 'express'
import db from '../models/index'

export const playerRouter = express.Router()

playerRouter.get('/', async (req, res) => {
    const users = await db.Users.findAll({
        raw: true,
    })

    const rankings = await db.Rankings.findAll({ raw: true })

    const response = []

    for (const ranking of rankings) {
        // split into correct zones, 1 / 2 / 3 / 4
        const { nameOnPlatform } = users.find(
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
                nameOnPlatform,
            })
        }
    }

    res.send(response)
})

playerRouter.get('/:id', async (req, res) => {
    const id = req.params.id

    const user = await db.Users.findOne({
        where: {
            accountId: id,
        },
        raw: true,
    })

    const trophies = await db.Trophies.findAll({
        where: {
            accountId: user.accountId,
        },
        raw: true,
    })

    if (!trophies) {
        // get trophies
    }

    res.send({ user, trophies })
})
