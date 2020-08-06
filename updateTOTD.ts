import dotenv from 'dotenv'
dotenv.config()
import { saveTOTD } from './server/totd'
;(async () => {
    const success = await saveTOTD()
    success ? console.log('Updated totd') : console.error('Updating totd failed')
})()
