import db from '../models/index.js'
import { Op } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()
import { updateRankings } from '../modules/players'
;(async () => {
    // first track players who are not tracked but have top 100 record in any seasonal track, totd leaderboard players are tracked when closed
    // todo: move this to leaderboard update...
    const leaderboards = await db.Leaderboards.findAll({
        include: { model: db.Maps, where: { campaign: { [Op.ne]: 'totd' } } },
    })
    const plain = leaderboards.map(record => record.get({ plain: true }))

    const users = []
    for (const leaderboard of plain) {
        for (const data of leaderboard.data) {
            if (!users.find(x => x === data.accountId)) users.push(data.accountId)
        }
    }

    for (const accountId of users) {
        db.Users.update({ tracking: true }, { where: { accountId } })
    }

    const success = await updateRankings()
    success ? console.log('Updated rankings') : console.error('Updating rankings failed')
})()
