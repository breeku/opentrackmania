import db from './models/index.js'
import {
    getTopPlayersMap,
    getProfilesById,
    getProfiles,
    getMapRecords,
    IwebIdentity,
} from 'trackmania-api-node'

import { login } from './login'
import { cache } from './cache'

export const topPlayersMap = async (
    maps: string[],
    retry: boolean = false,
    close: boolean = false,
) => {
    const credentials = (cache.get('credentials') as any) || (await login())
    if (credentials) {
        const dbAccounts = []
        const topPlayersMaps: any = []
        for (const map of maps) {
            try {
                const { mapId } = await db.Maps.findOne({
                    where: { mapUid: map },
                    raw: true,
                })
                const topPlayers = await getTopPlayersMap(
                    credentials.nadeoTokens.accessToken,
                    map,
                )

                for (const value of topPlayers.tops[0].top) {
                    const user = await db.Users.findOne({
                        where: { accountId: value.accountId },
                        raw: true,
                    })
                    if (user) dbAccounts.push(user)
                }

                const accountIds = topPlayers.tops[0].top.flatMap(
                    (a: { accountId: string }) => {
                        if (
                            !dbAccounts.find(
                                (d: { accountId: string }) => a.accountId === d.accountId,
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
                    console.log('Get new account ids')
                    accounts = await getProfiles(
                        credentials.ubiTokens.accessToken,
                        accountIds,
                    )
                    const { profiles } = await getProfilesById(
                        credentials.ticket,
                        accounts.map(x => x.uid),
                    )
                    profile = profiles
                } else {
                    console.log('All account ids are known')
                }

                const newTop = await Promise.all(
                    topPlayers.tops[0].top.map(async record => {
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

                            try {
                                const mapRecord = await getMapRecords(
                                    credentials.ubiTokens.accessToken,
                                    record.accountId,
                                    mapId,
                                )
                                return {
                                    ...record,
                                    nameOnPlatform: user.nameOnPlatform,
                                    ghost: mapRecord[0].url,
                                }
                            } catch (e) {
                                console.error(e.response.data)
                            }
                        }
                    }),
                )

                for (const account of dbAccounts) {
                    if (
                        !(await db.Users.findOne({
                            where: { accountId: account.accountId },
                        }))
                    )
                        await db.Users.create(account)
                }

                topPlayersMaps.push({ map, top: newTop })
            } catch (e) {
                console.warn(e.response)
                if (e.response.status === 401 && !retry) {
                    await login()
                    return await topPlayersMap(maps, true)
                }
            }
        }

        return await createOrUpdateLeaderboard(topPlayersMaps, close)
    }
}

const createOrUpdateLeaderboard = async (maps, close) => {
    for (const data of maps) {
        const { map, top } = data
        try {
            if (
                await db.Leaderboards.findOne({
                    where: {
                        mapUid: map,
                    },
                })
            ) {
                await db.Leaderboards.update(
                    {
                        mapUid: map,
                        data: top,
                        closed: close,
                    },
                    {
                        where: {
                            mapUid: map,
                        },
                    },
                )
            } else {
                await db.Leaderboards.create({
                    mapUid: map,
                    data: top,
                    closed: close,
                })
            }
        } catch (e) {
            console.error(e)
            return false
        }
    }
    return true
}
