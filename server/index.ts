import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

import { trackRouter } from './routes/tracks'
import { leaderboardRouter } from './routes/leaderboards'
import { totdRouter } from './routes/totd'
import { seasonRouter } from './routes/seasons'
import { playerRouter } from './routes/players'

const app = express()

app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/totds', totdRouter)
app.use('/api/tracks', trackRouter)
app.use('/api/seasons', seasonRouter)
app.use('/api/players', playerRouter)

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')))

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
}

app.listen(process.env.PORT || 8080)
