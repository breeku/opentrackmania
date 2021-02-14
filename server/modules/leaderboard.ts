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
                const dbMaps = await db.Maps.findOne({
                    where: { mapUid: map },
                    include: {
                        model: db.Leaderboards,
                        order: [['createdAt', 'DESC']],
                    },
                })
                const plain = dbMaps.get({ plain: true })
                const { mapId, Leaderboard } = plain
                const seasonUid = null // with seasonUid we can get >10 leaderboard records, disabled for now

                const topTen = seasonUid
                    ? await getTopGroupPlayersMap(
                          credentials.nadeoTokens.accessToken,
                          seasonUid,
                          map,
                      )
                    : await getTopPlayersMap(credentials.nadeoTokens.accessToken, map)

                const topPlayers = topTen.tops[0].top

                if (seasonUid) {
                    let lastScore = topPlayers[topPlayers.length - 1].score
                    let i = 0
                    while (i < 2) {
                        const scores = await getLeaderboardsAroundScore(
                            credentials.nadeoTokens.accessToken,
                            seasonUid,
                            map,
                            lastScore,
                        )
                        if (Object.keys(scores).length === 0) break
                        for (const record of scores.tops[0].top) {
                            if (
                                !topPlayers.find(x => x.accountId === record.accountId) &&
                                record.zoneName !== 'World' &&
                                record.position > 0
                            )
                                topPlayers.push(record)
                        }
                        const lastItem = scores.tops[0].top[scores.tops[0].top.length - 1]
                        lastScore = lastItem.score
                        i++
                    }
                }

                for (const value of topPlayers) {
                    const user = await db.Users.findOne({
                        where: { accountId: value.accountId },
                        raw: true,
                    })
                    if (user) dbAccounts.push(user)
                }

                const accountIds = topPlayers.flatMap(
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
                    topPlayers.map(async record => {
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

                            const oldRecord =
                                Leaderboard &&
                                Leaderboard.data &&
                                Leaderboard.data.find(
                                    x => x.accountId === record.accountId,
                                )

                            if (oldRecord) {
                                if (
                                    oldRecord.score !== record.score ||
                                    oldRecord.position !== record.position
                                ) {
                                    await db.Leaderboards_Activity.create({
                                        mapUid: map,
                                        accountId: record.accountId,
                                        oldScore: oldRecord.score,
                                        newScore: record.score,
                                        oldPosition: oldRecord.position,
                                        newPosition: record.position,
                                    })
                                }
                            }
                            try {
                                if (
                                    !oldRecord ||
                                    (oldRecord && oldRecord.score !== record.score) ||
                                    !oldRecord.ghost
                                ) {
                                    const mapRecord = await getMapRecords(
                                        credentials.ubiTokens.accessToken,
                                        record.accountId,
                                        mapId,
                                    )
                                    return {
                                        ...record,
                                        ghost: mapRecord[0].url,
                                    }
                                } else {
                                    return record
                                }
                            } catch (e) {
                                console.error(e)
                                return {
                                    ...record,
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
                            try {
                                const { rankings } = await getPlayerRankings(
                                    credentials.nadeoTokens.accessToken,
                                    [account.accountId],
                                )
                                const user = await db.Users.create(account)
                                if (user) await db.Rankings.create(rankings[0])
                            } catch (e) {
                                console.warn(e)
                            }
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

        for (const data of topPlayersMaps) {
            const { map, top } = data
            try {
                await db.Leaderboards.create({
                    mapUid: map,
                    data: top,
                    closed: close,
                })
            } catch (e) {
                console.error(e)
                return false
            }
        }
        return true
    }
}
