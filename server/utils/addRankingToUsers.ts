import dotenv from 'dotenv'
dotenv.config()
import db from '../models'
import { Op } from 'sequelize'
import { getPlayerRankings } from 'trackmania-api-node'
import { login } from '../modules/login'
import { array_chunks } from './index'
;(async () => {
    const users = await db.Users.findAll({ include: { model: db.Rankings } })

    const plain = users
        .map(user => user.get({ plain: true }))
        .filter(x => x.Rankings.length === 0)

    if (plain.length > 0) {
        const credentials = await login()
        const chunks = array_chunks(
            plain.map((x: { accountId: any }) => x.accountId),
            25,
        )
        for (const chunk of chunks) {
            const { rankings } = await getPlayerRankings(
                credentials.nadeoTokens.accessToken,
                chunk,
            )
            for (const ranking of rankings) {
                if (ranking) {
                    await db.Rankings.create(ranking)
                }
            }
        }
    }
})()
