import dotenv from 'dotenv'
dotenv.config()
import { TOTDs } from './server/totd'
;(async () => {
    await TOTDs()
})()
