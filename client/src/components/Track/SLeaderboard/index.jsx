import React from 'react'

import { Skeleton } from '@material-ui/lab'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    leaderboard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    record: {
        marginTop: '-20px',
        marginBottom: '-20px',
        width: '100%',
        height: 200,
        padding: 0,
    },
}))

export default function Leaderboard() {
    const classes = useStyles()
    return (
        <div className={classes.leaderboard}>
            <Skeleton width={200} height={100} />
            <Skeleton width={200} height={100} />
            {Array.from(Array(10).keys()).map(i => (
                <Skeleton className={classes.record} />
            ))}
        </div>
    )
}
