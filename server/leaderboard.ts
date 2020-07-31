import { db } from './db'
import {
    getTopPlayersMap,
    getProfilesById,
    getProfiles,
    getSeasons,
} from 'trackmania-api-node'

import { login } from './login'

// tslint:disable-next-line: no-var-requires
const sleep = require('util').promisify(setTimeout)

export const topPlayersFromSeasons = async () => {
    // probably should task a worker to this since it blocks for minute at a time
    const credentials = await login()
    if (credentials) {
        const seasons = await getSeasons(credentials.nadeoTokens.accessToken)
        if (seasons) {
            const result = []
            for (const campaign of seasons.campaignList) {
                const topPlayersMaps: any = []
                for (const map of campaign.playlist) {
                    try {
                        const topPlayers = await getTopPlayersMap(
                            credentials.nadeoTokens.accessToken,
                            map.mapUid,
                        )
                        // could first get all top players, then gather them all to big array to getprofiles and getprofilesbyid, many small requests vs one big
                        const accountIds = topPlayers.tops[0].top.map(
                            (x: { accountId: string }) => x.accountId,
                        )
                        const accounts = await getProfiles(
                            credentials.ubiTokens.accessToken,
                            accountIds,
                        )
                        const { profiles } = await getProfilesById(
                            credentials.ticket,
                            accounts.map(x => x.uid),
                        )

                        const newTop = topPlayers.tops[0].top.map(record => {
                            const user = accounts.flatMap(a => {
                                if (a.accountId === record.accountId) {
                                    const u = profiles.find(p => p.profileId === a.uid)
                                    return u
                                } else {
                                    return []
                                }
                            })[0]
                            if (user) {
                                return { ...record, name: user.nameOnPlatform }
                            }
                        })

                        topPlayersMaps.push({ map: map.mapUid, top: newTop })
                        console.log(
                            map.position +
                                ' (' +
                                map.position +
                                '/' +
                                (campaign.playlist.length - 1) +
                                ')',
                        )
                        await sleep(2500)
                    } catch (e) {
                        console.error(e)
                        console.warn('get top players map failed')
                        return false
                    }
                }
                result.push({ name: campaign.name, maps: topPlayersMaps })
            }
            db.set('leaderboard', result).write()
            return true
        } else {
            return false
        }
    }
}
