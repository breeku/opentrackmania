import React from 'react'

import { Grid } from '@material-ui/core'

import { getPlayerRecords } from '@services/players'

import RecordList from './RecordList'

export default function Records({ id }) {
    const [playerRecords, setPlayerRecords] = React.useState(null)

    React.useEffect(() => {
        const getData = async () => {
            const response = await getPlayerRecords(id)
            setPlayerRecords(response)
        }
        getData()
    }, [id])

    return (
        <>
            {playerRecords && (
                <>
                    <h3>Records</h3>
                    <h6 style={{ padding: 0, margin: 0 }}>
                        Records found: {playerRecords.length}
                    </h6>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            {playerRecords.map(record => (
                                <RecordList record={record} />
                            ))}
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    )
}
