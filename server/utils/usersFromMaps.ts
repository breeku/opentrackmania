import dotenv from 'dotenv'
dotenv.config()
import db from '../models'

import { login } from '../modules/login'
import { namesFromAccountIds } from '../modules/players'
import { array_chunks } from './index'
import { Op } from 'sequelize'
;(async () => {
    const maps = await db.Maps.findAll({ raw: true })
    const accountIds = maps
        .flatMap(track => {
            if (!track.accountId) {
                const { author } = track.data
                return author
            } else {
                return []
            }
        })
        .filter((value, index, self) => self.indexOf(value) === index)

    if (accountIds.length > 0) {
        const accounts = await db.Users.findAll({
            where: {
                accountId: {
                    [Op.in]: accountIds,
                },
            },
            raw: true,
        }).then(e => e.map(x => x.accountId))

        const filtered = accountIds.filter(x => !accounts.find(i => x === i))

        const users = { accounts: [], profiles: [] }

        const chunks = array_chunks(filtered, 10)
        const credentials = await login()
        for (const chunk of chunks) {
            try {
                const profiles = await namesFromAccountIds(chunk, credentials)
                users.accounts.push(...profiles.accounts)
                users.profiles.push(...profiles.profiles)
            } catch (e) {
                console.error(e)
            }
        }
        const combined = users.accounts.flatMap(account => {
            return users.profiles.flatMap(profile => {
                if (profile.profileId === account.uid && account.provider === 'uplay') {
                    return {
                        nameOnPlatform: profile.nameOnPlatform,
                        accountId: account.accountId,
                    }
                } else {
                    return []
                }
            })
        })

        for (const user of combined) {
            try {
                if (
                    !(await db.Users.findOne({
                        where: { accountId: user.accountId },
                        raw: true,
                    }))
                )
                    await db.Users.create(user)
            } catch (e) {
                console.warn(e)
            }
        }
    } else {
        console.log('Already up to date!')
    }
})()
