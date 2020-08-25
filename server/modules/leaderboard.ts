import db from '../models/index.js'
import {
    getTopPlayersMap,
    getMapRecords,
    getPlayerRankings,
    getTopGroupPlayersMap,
    getLeaderboardsAroundScore,
} from 'trackmania-api-node'

import { QueryTypes } from 'sequelize'

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
                    raw: true,
                })
                const recent = await db.leaderboard_new.findOne({
                    where: { mapUid: map },
                    raw: true,
                    order: [['createdAt', 'DESC']],
                })

                const fromDate = new Date(recent.createdAt - 300000).toISOString()
                const toDate = recent.createdAt.toISOString()

                const leaderboard = await db.sequelize.query(
                    `
                    SELECT *
                    FROM  (
                        SELECT DISTINCT ON ("accountId") *
                        FROM "leaderboard_news"
                        WHERE "createdAt" 
                        BETWEEN '${fromDate}'
                        AND '${toDate}'
                        AND "mapUid"='${map}'
                        ) p
                    ORDER BY "updatedAt" DESC;
                    `,
                    { type: QueryTypes.SELECT },
                )

                const { mapId, seasonUid } = dbMaps

                const topTen = seasonUid
                    ? await getTopGroupPlayersMap(
                          credentials.nadeoTokens.accessToken,
                          seasonUid,
                          map,
                      )
                    : await getTopPlayersMap(credentials.nadeoTokens.accessToken, map)

                const topPlayers = topTen.tops[0].top

                if (seasonUid) {
                    let lastScore = topPlayers[0].score
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
                                leaderboard &&
                                leaderboard.find(x => x.accountId === record.accountId)

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
                                    console.log('Getting new ghost')
                                    return {
                                        ...record,
                                        ghost: mapRecord[0].url,
                                    }
                                } else {
                                    return {
                                        ...record,
                                        ghost: oldRecord && oldRecord.ghost,
                                    }
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
                                if (rankings[0] && rankings[0].zones) {
                                    await db.Users.create({
                                        ...account,
                                        zones: rankings[0].zones.map(x => {
                                            return {
                                                zoneName: x.zoneName,
                                                zoneId: x.zoneId,
                                            }
                                        }),
                                    })
                                    await db.Rankings.create(rankings[0])
                                } else {
                                    console.warn(
                                        'Rankings not found for ' +
                                            account.nameOnPlatform,
                                    )
                                    console.warn(rankings)

                                    console.log('Creating user without zones..')
                                    await db.Users.create({
                                        ...account,
                                    })
                                }
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
                for (const record of top) {
                    await db.leaderboard_new.create({
                        mapUid: map,
                        closed: close,
                        accountId: record.accountId,
                        score: record.score,
                        position: record.position,
                        ghost: record.ghost,
                    })
                }
            } catch (e) {
                console.error(e)
                return false
            }
        }
        return true
    }
}
