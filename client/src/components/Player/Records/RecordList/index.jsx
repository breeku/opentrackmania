import React from 'react'

import { useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'

import { setTrack } from '@redux/store/tracks'
import { textParser } from '@utils'
import { useProgressiveImage } from '@utils/imageLoader'

const useStyles = makeStyles(theme => ({
    track: {
        margin: 30,
        backgroundColor: '#202020',
        color: '#fff',
        height: 125,
        cursor: 'pointer',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        transition: 'all 0.5s',
        backgroundImage: props => props.loaded && `${`url(${props.loaded})`}`,
        opacity: props => (props.loaded ? 100 : 0),
        '&:hover': {
            scale: '1.02',
        },
    },
    track_date: {
        padding: 0,
        margin: 0,
    },
    track_map: {
        padding: 0,
        margin: 0,
    },
    track_cover: {
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
    },
    no_decoration: {
        textDecoration: 'none',
    },
    grid: {},
}))

export default function RecordList({ record }) {
    const loaded = useProgressiveImage(record && record['Map.data'].thumbnailUrl)
    const classes = useStyles({ loaded })
    const dispatch = useDispatch()

    return (
        <div className={classes.grid}>
            <Link
                to={{
                    pathname: `/track/${record['Map.mapUid']}`,
                }}
                className={classes.no_decoration}
                onClick={() => dispatch(setTrack(record.Map))}>
                <Paper className={classes.track} elevation={2}>
                    <div className={classes.track_cover}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={4}>
                                <h2 className={classes.track_map}>
                                    {textParser(record['Map.data'].name)}
                                </h2>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <h2 className={classes.track_map}>
                                    #{record.data.position}
                                </h2>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <h2 className={classes.track_map}>
                                    {new Date(record.data.score)
                                        .toISOString()
                                        .slice(14, -1)}
                                </h2>
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
            </Link>
        </div>
    )
}
