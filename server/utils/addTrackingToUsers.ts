import db from '../models'
;(async () => {
    const rankings = await db.Rankings.findAll({ raw: true })
    const users = []

    users.push(
        ...rankings
            .filter(x => x.zones && x.zones[0].ranking.position <= 500)
            .filter((v, i, a) => a.findIndex(t => t.accountId === v.accountId) === i)
            .map(x => x.accountId),
    )

    const leaderboards = await db.Leaderboards.findAll({ raw: true })

    for (const leaderboard of leaderboards) {
        for (const data of leaderboard.data) {
            if (!users.find(x => x === data.accountId)) users.push(data.accountId)
        }
    }

    for (const accountId of users) {
        db.Users.update({ tracking: true }, { where: { accountId } })
    }
})()
