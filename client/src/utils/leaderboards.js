export const getTopTen = leaderboards => {
    const maps = leaderboards.flatMap(x => x.data)

    const names = maps.flatMap(x => x.nameOnPlatform)
    const regions = maps.flatMap(x => x.zoneName)

    let players = []
    let zones = []
    for (const nameOnPlatform of names) {
        // change this to reduce
        if (!players.find(x => x.nameOnPlatform === nameOnPlatform)) {
            const count = names.filter(x => x === nameOnPlatform).length
            players.push({ nameOnPlatform, count })
        }
    }

    for (const zone of regions) {
        // change this to reduce
        if (!zones.find(x => x.zone === zone)) {
            const count = regions.filter(x => x === zone).length
            zones.push({ zone, count })
        }
    }

    players.sort((a, b) => b.count - a.count)
    zones.sort((a, b) => b.count - a.count)

    return { players: players.slice(0, 10), zones: zones.slice(0, 10) }
}
