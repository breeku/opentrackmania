import dotenv from 'dotenv'
dotenv.config()
import { TOTDs } from './server/totd'
;(async () => {
    const success = await TOTDs()
    success ? console.log('Updated totd') : console.error('Updating totd failed')
})()
