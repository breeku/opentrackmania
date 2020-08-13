import { loginUbi, loginTrackmaniaUbi, loginTrackmaniaNadeo } from 'trackmania-api-node'
import { cache } from '../cache'

export const login = async (): Promise<{
    ticket: string
    ubiTokens: any
    nadeoTokens: any
    accountId: string
}> => {
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
        const obj = { ticket, ubiTokens, nadeoTokens, accountId: nadeoTokens.accountId }
        cache.set('credentials', obj)
        console.log('set cache')
        return obj
    } catch (e) {
        console.log(e.toJSON())
    }
}
