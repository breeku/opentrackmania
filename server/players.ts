import db from './models/index.js'
import {
    getProfilesById,
    getProfiles,
    getTrophyCount,
    getPlayerRankings,
} from 'trackmania-api-node'
import { login } from './login'
import { Op } from 'sequelize'
import { cache } from './cache'

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

export const saveTrophies = async (accountId: string, retry = false, mode: string) => {
    const credentials = (cache.get('credentials') as any) || (await login())
    if (credentials) {
        try {
            let trophies = await getTrophyCount(
                credentials.ubiTokens.accessToken,
                accountId,
            )

            if (mode === 'CREATE') {
                trophies = await db.Trophies.create({ accountId, data: trophies })
            } else if (mode === 'UPDATE') {
                const updated = await db.Trophies.update(
                    { accountId, data: trophies },
                    {
                        where: {
                            accountId,
                        },
                        returning: true,
                        raw: true,
                    },
                )
                trophies = updated[1][0]
            }
            return trophies
        } catch (e) {
            console.warn(e.response)
            if (e.response.status === 401 && !retry) {
                await login()
                return await saveTrophies(accountId, true, mode)
            }
        }
    }
}

export const updateRankings = async (): Promise<boolean> => {
    const credentials = await login()

    try {
        const users = await db.Users.findAll({ raw: true })

        for (let i = 0, offset = 100; i < users.length; offset *= 2, i += 100) {
            const sliced = users
                .map((x: { accountId: any }) => x.accountId)
                .slice(i, offset)
            const { rankings } = await getPlayerRankings(
                credentials.nadeoTokens.accessToken,
                sliced,
            )

            for (const ranking of rankings) {
                await db.Rankings.create(ranking)
            }

            await new Promise(r => setTimeout(r, 2500))
        }

        return true
    } catch (e) {
        console.error(e)
        return false
    }
}
