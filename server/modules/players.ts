import db from '../models/index.js'
import {
    getProfilesById,
    getProfiles,
    getTrophyCount,
    getPlayerRankings,
} from 'trackmania-api-node'
import { login } from './login'
import { cache } from '../cache'
import { array_chunks } from '../utils/'

export const namesFromAccountIds = async (
    accountIds: any[],
    credentials: { ubiTokens: { accessToken: string }; ticket: string },
): Promise<{ accounts: any[]; profiles: any[] }> => {
    try {
        const result = { accounts: [], profiles: [] }
        const chunks = array_chunks(accountIds, 25)
        for (const chunk of chunks) {
            const accounts = await getProfiles(credentials.ubiTokens.accessToken, chunk)
            if (accounts.length === 0) {
                console.warn('No account(s) found for ' + chunk)
                break
            }
            const { profiles } = await getProfilesById(
                credentials.ticket,
                accounts.map(x => x.uid),
            )
            result.accounts.push(...accounts)
            result.profiles.push(...profiles)
        }
        return result
    } catch (e) {
        console.warn(e)
    }
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

        const chunks = array_chunks(
            users.map((x: { accountId: any }) => x.accountId),
            250,
        )
        for (const chunk of chunks) {
            const { rankings } = await getPlayerRankings(
                credentials.nadeoTokens.accessToken,
                chunk,
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

export const createUser = async (
    accountId: string,
    credentials: {
        ticket: string
        ubiTokens: any
        nadeoTokens: any
        accountId?: string
    },
): Promise<void> => {
    const res = await namesFromAccountIds([accountId], credentials)
    if (res) {
        const { profiles } = res
        const { rankings } = await getPlayerRankings(
            credentials.nadeoTokens.accessToken,
            [accountId],
        )
        await db.Users.create({
            nameOnPlatform: profiles[0].nameOnPlatform,
            accountId: accountId,
        })
        await db.Rankings.create(rankings[0])
    }
}
