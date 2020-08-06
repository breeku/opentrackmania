import React from 'react'

import { useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'

import { setTrack } from '../../redux/store/tracks'
import { textParser } from '../../utils'
import { useProgressiveImage } from '../../utils/imageLoader'

const useStyles = makeStyles(theme => ({
    track: {
        minHeight: 150,
        backgroundColor: '#202020',
        color: '#fff',
        height: '100%',
        transition: 'all 0.1s',
        cursor: 'pointer',
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
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
    },
}))

export default function TrackList({ track }) {
    const { day, month, map } = track
    const classes = useStyles()
    const loaded = useProgressiveImage(track && map.thumbnailUrl)
    const dispatch = useDispatch()

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Link
                to={{
                    pathname: `/track/${map.mapUid}`,
                }}
                style={{
                    textDecoration: 'none',
                }}
                onClick={() => dispatch(setTrack(map))}>
                <Paper
                    className={classes.track}
                    style={{
                        backgroundImage: loaded && `${`url(${loaded})`}`,
                        opacity: loaded ? '100' : '0',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        transition: 'all 0.5s',
                    }}>
                    <div className={classes.track_cover}>
                        {day && month && (
                            <h4 className={classes.track_date}>
                                {day}/{month}
                            </h4>
                        )}
                        <h2 className={classes.track_map}>{textParser(map.name)}</h2>
                    </div>
                </Paper>
            </Link>
        </Grid>
    )
}
