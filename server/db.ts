import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

interface Database {
    leaderboard: any[]
}

const adapter = new FileSync<Database>('db.json')
export const db = low(adapter)
