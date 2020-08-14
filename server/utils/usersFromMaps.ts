import dotenv from 'dotenv'
dotenv.config()
import db from '../models'

import { login } from '../modules/login'
import { namesFromAccountIds } from '../modules/players'
import { array_chunks } from './index'
;(async () => {
    const maps = await db.Maps.findAll({ raw: true })
    const accountIds = maps
        .flatMap(track => {
            const { author } = track.data
            return author
        })
        .filter((value, index, self) => self.indexOf(value) === index)

    for (const id of accountIds) {
        // couldnt get flatmap to work in promies ._.
        const user = await db.Users.findOne({
            where: { accountId: id },
            raw: true,
        })
        if (user) {
            const index = accountIds.indexOf(id)
            console.log(index, user)
            accountIds.splice(index, 1)
        }
    }

    const users = { accounts: [], profiles: [] }

    const credentials = await login()
    const chunks = array_chunks(accountIds, 10)
    for (const chunk of chunks) {
        const profiles = await namesFromAccountIds(chunk, credentials)
        users.accounts.push(...profiles.accounts)
        users.profiles.push(...profiles.profiles)
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
            await db.Users.create(user)
        } catch (e) {
            console.warn(e)
        }
    }
})()
