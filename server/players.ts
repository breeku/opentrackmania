import db from './models/index.js'
import {
    getProfilesById,
    getProfiles,
    getTrophyCount,
    getPlayerRankings,
} from 'trackmania-api-node'
import { login } from './login'

export const namesFromAccountIds = async (
    accountIds: any[],
    credentials: { ubiTokens: { accessToken: string }; ticket: string },
): Promise<{ accounts: any[]; profiles: any[] }> => {
    const accounts = await getProfiles(credentials.ubiTokens.accessToken, accountIds)
    const { profiles } = await getProfilesById(
        credentials.ticket,
        accounts.map(x => x.uid),
    )
    const result = { accounts, profiles }
    return result
}

export const saveTrophies = async (accountId: string): Promise<boolean> => {
    const credentials = await login()
    if (credentials) {
        try {
            /*
            const trophies = await getTrophyCount(
                credentials.ubiTokens.accessToken,
                accountId,
            )
            */
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}

export const updateRankings = async (): Promise<boolean> => {
    const credentials = await login()
    if (credentials) {
        try {
            const users = await db.Users.findAll({ raw: true })

            for (let i = 0, offset = 24; i < users.length; offset *= 2, i += 24) {
                const sliced = users
                    .map((x: { accountId: any }) => x.accountId)
                    .slice(i, offset)
                const { rankings } = await getPlayerRankings(
                    credentials.nadeoTokens.accessToken,
                    sliced,
                )

                for (const ranking of rankings) {
                    if (
                        await db.Rankings.findOne({
                            where: {
                                accountId: ranking.accountId,
                            },
                        })
                    ) {
                        await db.Rankings.update(ranking, {
                            where: {
                                accountId: ranking.accountId,
                            },
                        })
                    } else {
                        await db.Rankings.create(ranking)
                    }
                }

                await new Promise(r => setTimeout(r, 1000))
            }
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}
