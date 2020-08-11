import React from 'react'

import { Skeleton } from '@material-ui/lab'

import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    trophies: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    trophy: {
        width: '100%',
        height: 100,
    },
    grid: {
        marginTop: '-20px',
        marginBottom: '-20px',
    },
}))

export default function STrophies() {
    const classes = useStyles()
    return (
        <div className={classes.trophies}>
            <Skeleton width={200} height={100} />
            <Skeleton width={200} height={100} />
            <Grid container spacing={3}>
                {Array.from(Array(9).keys()).map(i => (
                    <Grid item xs={12} sm={6} className={classes.grid}>
                        <Skeleton className={classes.trophy} />
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
