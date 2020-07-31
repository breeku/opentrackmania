import { loginUbi, loginTrackmaniaUbi, loginTrackmaniaNadeo } from 'trackmania-api-node'
import dotenv from 'dotenv'
dotenv.config()

export const login = async () => {
    const credentials = Buffer.from(process.env.USER + ':' + process.env.PASS).toString(
        'base64',
    )
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
