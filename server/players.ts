import { getProfilesById, getProfiles } from 'trackmania-api-node'

export const namesFromAccountIds = async (accountIds, credentials) => {
    const accounts = await getProfiles(credentials.ubiTokens.accessToken, accountIds)
    const { profiles } = await getProfilesById(
        credentials.ticket,
        accounts.map(x => x.uid),
    )
    return profiles
}
