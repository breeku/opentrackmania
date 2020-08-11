import db from './models/index.js'
import {
    getProfilesById,
    getProfiles,
    getTrophyCount,
    getPlayerRankings,
} from 'trackmania-api-node'
import { login } from './login'
import { Op } from 'sequelize'

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
            const recent = await db.Rankings.findOne({
                raw: true,
                order: [['createdAt', 'DESC']],
            })

            const oldest = await db.Rankings.findOne({
                raw: true,
                order: [['createdAt', 'ASC']],
            })

            if (recent && oldest) {
                const recentDate = new Date(recent.createdAt).getTime()
                const oldestDate = new Date(oldest.createdAt).getTime()

                const dayDifference = Math.ceil(
                    Math.abs(oldestDate - recentDate) / (1000 * 60 * 60 * 24),
                )

                console.log(
                    'Day difference between most recent and oldest: ' + dayDifference,
                )
                if (dayDifference > 7) {
                    console.log('Day difference > 7, destroying oldest')
                    await db.Rankings.destroy({
                        where: {
                            createdAt: {
                                [Op.lte]: oldest.createdAt,
                                [Op.gte]: new Date(
                                    oldest.createdAt - 23 * 3600 * 1000,
                                ).toISOString(),
                            },
                        },
                    })
                }
            }

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
}
