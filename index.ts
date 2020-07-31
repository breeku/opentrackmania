import express from 'express'
import path from 'path'
import cron from 'node-cron'
import dotenv from 'dotenv'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import NodeCache from 'node-cache'
import {
    loginUbi,
    loginTrackmaniaUbi,
    loginTrackmaniaNadeo,
    getSeasons,
    getTopPlayersMap,
    getProfilesById,
    getProfiles,
    IallSeasons,
    IloginTrackmania,
} from 'trackmania-api-node'

interface Database {
    leaderboard: Array<any>
}

dotenv.config()
const adapter = new FileSync<Database>('db.json')
const db = low(adapter)
const app = express()
const nodeCache = new NodeCache()
const sleep = require('util').promisify(setTimeout)

db.defaults({ leaderboard: [] }).write()

app.use(express.static(path.join(__dirname, 'build')))

app.get('/api/leaderboard', (req, res) => {
    const leaderboard = db.get('leaderboard').value()
    return res.send(leaderboard)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

cron.schedule('0 * * * *', async () => {
    // 0 * * * * every hour
    // 0 0 */3 * * every 3 h
    console.log('running a task every hour')

    const credentials = nodeCache.get('login') as loggedIn
    if (credentials) {
        console.log('Retrieved cache')
        const updated = await topPlayersFromSeasons(credentials)
        if (updated) {
            console.log('Leaderboard update success')
        } else {
            console.warn('Leaderboard update failed')

            console.log('Relogging')
            const credentials = Buffer.from(
                process.env.USER + ':' + process.env.PASS,
            ).toString('base64')
            const loggedIn = await login(credentials)
            let cached = nodeCache.set('login', loggedIn)
            if (cached) {
                console.log('Saved login data to cache')
            } else {
                console.error('Couldnt save data to cache')
            }
            console.log('Retrying leaderboard update')
            const updated = await topPlayersFromSeasons(loggedIn as loggedIn)
            if (updated) {
                console.log('Leaderboard update success')
            } else {
                console.warn('Leaderboard update failed')
            }
        }
    }
})

app.listen(8080)

const login = async (credentials: string) => {
    try {
        const { ticket } = await loginUbi(credentials)
        const ubiTokens = await loginTrackmaniaUbi(ticket)
        const nadeoTokens = await loginTrackmaniaNadeo(
            ubiTokens.accessToken,
            'NadeoLiveServices',
        )
        return {
            ticket,
            ubiTokens,
            nadeoTokens,
            accountId: nadeoTokens.accountId,
        }
    } catch (e) {
        console.log(e.toJSON())
    }
}

const topPlayersFromSeasons = async (credentials: loggedIn) => {
    const seasons = nodeCache.get('seasons') as IallSeasons
    if (credentials) {
        let result = []
        console.log('Retrieved credentials and seasons')
        for (const campaign of seasons.campaignList) {
            let topPlayersMaps: any = []
            for (const map of campaign.playlist) {
                try {
                    const topPlayers = await getTopPlayersMap(
                        credentials.nadeoTokens.accessToken,
                        map.mapUid,
                    )
                    const accountIds = topPlayers.tops[0].top.map(
                        (x: { accountId: string }) => x.accountId,
                    )
                    const accounts = await getProfiles(
                        credentials.ubiTokens.accessToken,
                        accountIds,
                    )
                    const { profiles } = await getProfilesById(
                        credentials.ticket,
                        accounts.map(x => x.uid),
                    )

                    const newTop = topPlayers.tops[0].top.map(record => {
                        const user = accounts.flatMap(a => {
                            if (a.accountId === record.accountId) {
                                const user = profiles.find(p => p.profileId === a.uid)
                                return user
                            } else {
                                return []
                            }
                        })[0]
                        if (user) {
                            return { ...record, name: user.nameOnPlatform }
                        }
                    })

                    topPlayersMaps.push({ map: map.mapUid, top: newTop })
                    console.log(
                        map.position +
                            ' (' +
                            map.position +
                            '/' +
                            (campaign.playlist.length - 1) +
                            ')',
                    )
                    await sleep(1000)
                } catch (e) {
                    console.error(e)
                    console.warn('get top players map failed')
                    return false
                }
            }
            result.push({ name: campaign.name, maps: topPlayersMaps })
        }
        db.set('leaderboard', result).write()
        return true
    } else {
        console.error('Failed to retrieve cache')
        return false
    }
}

;(async () => {
    const credentials = Buffer.from(process.env.USER + ':' + process.env.PASS).toString(
        'base64',
    )
    const loggedIn = await login(credentials)
    if (loggedIn) {
        console.log('Logged in!')
        let cached = nodeCache.set('login', loggedIn)
        if (cached) {
            console.log('Saved login data to cache')
        } else {
            console.error('Couldnt save data to cache')
        }

        const seasons = await getSeasons(loggedIn.nadeoTokens.accessToken)
        cached = nodeCache.set('seasons', seasons)
        if (cached) {
            console.log('Saved season data to cache')

            topPlayersFromSeasons(loggedIn)
        } else {
            console.error('Couldnt save data to cache')
        }
    } else {
        console.error('Couldnt login')
    }
})()

type loggedIn = {
    ticket: string
    ubiTokens: IloginTrackmania
    nadeoTokens: IloginTrackmania
    accountId: string
}
