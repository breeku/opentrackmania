import db from '../models/index.js'
import {
    getTopPlayersMap,
    getMapRecords,
    getPlayerRankings,
    getTopGroupPlayersMap,
    getLeaderboardsAroundScore,
} from 'trackmania-api-node'

import { login } from './login'
import { cache } from '../cache'
import { namesFromAccountIds } from './players'

export const topPlayersMap = async (
    maps: string[],
    retry = false,
    close = false,
): Promise<boolean> => {
    const credentials = (cache.get('credentials') as any) || (await login())
    if (credentials) {
        const dbAccounts = []
        const topPlayersMaps: any = []

        for (const map of maps) {
            try {
                const { mapId, seasonUid } = await db.Maps.findOne({
                    where: { mapUid: map },
                    raw: true,
                })
                const topPlayers = seasonUid
                    ? await getTopGroupPlayersMap(
                          credentials.nadeoTokens.accessToken,
                          seasonUid,
                          map,
                      )
                    : await getTopPlayersMap(credentials.nadeoTokens.accessToken, map)

                if (seasonUid) {
                    let lastScore =
                        topPlayers.tops[0].top[topPlayers.tops[0].top.length - 1].score
                    let pos = 0
                    let i = 0
                    while (pos < 50 || i > 10) {
                        const scores = await getLeaderboardsAroundScore(
                            credentials.nadeoTokens.accessToken,
                            seasonUid,
                            map,
                            lastScore,
                        )
                        for (const record of scores.levels[0].level) {
                            if (
                                !topPlayers.tops[0].top.find(
                                    x => x.accountId === record.accountId,
                                ) &&
                                record.zoneName !== 'World' &&
                                record.position > 0
                            )
                                topPlayers.tops[0].top.push(record)
                        }
                        const lastItem =
                            scores.levels[0].level[scores.levels[0].level.length - 1]
                        pos = lastItem.position
                        if (pos === 0) break
                        lastScore = lastItem.score
                        i++
                        console.log(pos, i)
                    }
                }

                for (const value of topPlayers.tops[0].top) {
                    const user = await db.Users.findOne({
                        where: { accountId: value.accountId },
                        raw: true,
                    })
                    if (user) dbAccounts.push(user)
                }

                const accountIds = topPlayers.tops[0].top.flatMap(
                    (account: { accountId: string }) => {
                        if (
                            !dbAccounts.find(
                                (dbAccount: { accountId: string }) =>
                                    account.accountId === dbAccount.accountId,
                            )
                        ) {
                            return account.accountId
                        } else {
                            return []
                        }
                    },
                )

                const { accounts, profiles } =
                    accountIds.length > 0 &&
                    (await namesFromAccountIds(accountIds, credentials))

                const newTop = await Promise.all(
                    topPlayers.tops[0].top.map(async record => {
                        const user =
                            dbAccounts.find(
                                (x: { accountId: string }) =>
                                    x.accountId === record.accountId,
                            ) ||
                            accounts.flatMap(account => {
                                if (account.accountId === record.accountId) {
                                    return profiles.find(
                                        profile => profile.profileId === account.uid,
                                    )
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
                                console.error(e)
                                return {
                                    ...record,
                                    nameOnPlatform: user.nameOnPlatform,
                                    ghost: null,
                                }
                            }
                        }
                    }),
                )

                if (dbAccounts.length > 0) {
                    for (const account of dbAccounts) {
                        const user = await db.Users.findOne({
                            where: { accountId: account.accountId },
                            raw: true,
                        })
                        if (!user) {
                            const { rankings } = await getPlayerRankings(
                                credentials.nadeoTokens.accessToken,
                                [account.accountId],
                            )
                            await db.Users.create(account)
                            await db.Rankings.create(rankings[0])
                        }
                    }
                }

                topPlayersMaps.push({
                    map,
                    top: newTop.sort((a, b) => a.position - b.position),
                })
            } catch (e) {
                console.warn(e)
                if (e.response && e.response.status === 401 && !retry) {
                    await login()
                    return await topPlayersMap(maps, true, close)
                }
            }
        }

        return await createOrUpdateLeaderboard(topPlayersMaps, close)
    }
}

const createOrUpdateLeaderboard = async (
    maps: { map: string; top: any[] }[],
    close: boolean,
) => {
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
