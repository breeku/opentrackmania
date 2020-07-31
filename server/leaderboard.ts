import { db } from './db'
import {
    getTopPlayersMap,
    getProfilesById,
    getProfiles,
    getSeasons,
    IwebIdentity,
} from 'trackmania-api-node'

import { login } from './login'

// tslint:disable-next-line: no-var-requires
const sleep = require('util').promisify(setTimeout)

export const topPlayersFromSeasons = async () => {
    // probably should task a worker to this
    const credentials = await login()
    if (credentials) {
        const seasons = await getSeasons(credentials.nadeoTokens.accessToken)
        if (seasons) {
            const result = []
            const dbAccounts = db.get('accounts').value()
            for (const campaign of seasons.campaignList) {
                const topPlayersMaps: any = []
                for (const map of campaign.playlist) {
                    try {
                        const topPlayers = await getTopPlayersMap(
                            credentials.nadeoTokens.accessToken,
                            map.mapUid,
                        )
                        const accountIds = topPlayers.tops[0].top.flatMap(
                            (a: { accountId: string }) => {
                                if (
                                    !dbAccounts.find(
                                        (d: { accountId: string }) =>
                                            a.accountId === d.accountId,
                                    )
                                ) {
                                    return a.accountId
                                } else {
                                    return []
                                }
                            },
                        )

                        let accounts: IwebIdentity[] = []
                        let profile: any[] = []

                        if (accountIds.length > 0) {
                            accounts = await getProfiles(
                                credentials.ubiTokens.accessToken,
                                accountIds,
                            )
                            const { profiles } = await getProfilesById(
                                credentials.ticket,
                                accounts.map(x => x.uid),
                            )
                            profile = profiles
                        }

                        const newTop = topPlayers.tops[0].top.map(record => {
                            const user =
                                dbAccounts.find(
                                    (x: { accountId: string }) =>
                                        x.accountId === record.accountId,
                                ) ||
                                accounts.flatMap(a => {
                                    if (a.accountId === record.accountId) {
                                        const u = profile.find(p => p.profileId === a.uid)
                                        return u
                                    } else {
                                        return []
                                    }
                                })[0]
                            if (user) {
                                if (
                                    !dbAccounts.find(
                                        (x: { accountId: string }) =>
                                            x.accountId === record.accountId,
                                    )
                                )
                                    dbAccounts.push({
                                        accountId: record.accountId,
                                        nameOnPlatform: user.nameOnPlatform,
                                    })

                                return { ...record, nameOnPlatform: user.nameOnPlatform }
                            }
                        })

                        db.set('accounts', dbAccounts).write()

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
