import db from '../models'
import { topPlayersMap } from '../modules/leaderboard'
;(async () => {
    const maps = await db.Maps.findAll({
        where: { campaign: 'totd' },
        raw: true,
        attributes: ['mapUid'],
    })
    const mapUids = maps.map(x => x.mapUid)
    await topPlayersMap(mapUids, false, true)
})()
