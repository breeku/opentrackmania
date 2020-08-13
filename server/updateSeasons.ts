import dotenv from 'dotenv'
dotenv.config()
import { saveSeasons } from './seasons'
;(async () => {
    const success = await saveSeasons()
    success ? console.log('Updated seasons') : console.error('Updating seasons failed')
})()
