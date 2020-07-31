import express from 'express'
import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import { topPlayersFromSeasons } from './server/leaderboard'

interface Database {
    leaderboard: Array<any>
}

const adapter = new FileSync<Database>('db.json')
const db = low(adapter)
const app = express()

db.defaults({ leaderboard: [] }).write()

app.use(express.static(path.join(__dirname, 'build')))

app.get('/api/leaderboard', (req, res) => {
    const leaderboard = db.get('leaderboard').value()
    return res.send(leaderboard)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})

app.listen(process.env.PORT || 8080)
;(async () => {
    const success = topPlayersFromSeasons()
    success
        ? console.log('Updated leaderboards')
        : console.error('Updating leaderboards failed')
})()
