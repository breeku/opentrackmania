import db from '../models'
;(async () => {
    const maps = await db.Maps.findAll({ raw: true })
    for (const map of maps) {
        await db.Maps.update(
            { ...map, accountId: map.data.author },
            { where: { id: map.id } },
        )
    }
})()
