import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

import { trackRouter } from './server/routes/tracks'
import { leaderboardRouter } from './server/routes/leaderboards'
import { totdRouter } from './server/routes/totd'
import { seasonRouter } from './server/routes/seasons'

const app = express()

app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/totds', totdRouter)
app.use('/api/tracks', trackRouter)
app.use('/api/seasons', seasonRouter)

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')))

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
}

app.listen(process.env.PORT || 8080)
