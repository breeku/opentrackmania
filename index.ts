import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

import { Op } from 'sequelize'
import db from './server/models/index'
import { leaderboardRouter } from './server/routes/leaderboards'
import { totdRouter } from './server/routes/totd'

const app = express()

app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/totds', totdRouter)

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')))

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
}

app.listen(process.env.PORT || 8080)
;(async () => {
    try {
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
})()
