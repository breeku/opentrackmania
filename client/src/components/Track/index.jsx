import React from 'react'

import { Redirect } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid } from '@material-ui/core'

import { textParser } from '../../utils/textParser'

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: '#202020',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight: '40vh',
    },
    hero: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    cover: {
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: 3,
        borderRadius: 4,
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    times: {
        color: '#fff',
        backgroundColor: '#202020',
        marginTop: 20,
        padding: 20,
        width: '50%',
        margin: 'auto',
    },
}))

export default function Track() {
    const { track } = useSelector(state => state.tracks)
    const classes = useStyles()
    const { pathname } = useLocation()

    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    console.log(track)
    return (
        <>
            {!track ? (
                <Redirect
                    to={{
                        pathname: '/totd',
                    }}
                />
            ) : (
                <>
                    <Paper className={classes.paper}>
                        <div
                            className={classes.hero}
                            style={{
                                backgroundImage: `${`url(${track.thumbnailUrl}`}`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                filter: 'blur(8px)',
                            }}
                        />
                        <div className={classes.cover}>
                            <div className={classes.title}>
                                <h1>{textParser(track.name)}</h1>
                            </div>
                        </div>
                    </Paper>
                    <h1 style={{ textAlign: 'center' }}>Times</h1>
                    <Grid container direction="column" justify="center" align="center">
                        <Grid item>
                            <Paper className={classes.times}>
                                <h3>🏆Author</h3>
                                <h3>{(track.authorScore / 1000).toFixed(3)}s</h3>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper className={classes.times}>
                                <h3>🥇Gold</h3>
                                <h3>{(track.goldScore / 1000).toFixed(3)}s</h3>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper className={classes.times}>
                                <h3>🥈Silver</h3>
                                <h3>{(track.silverScore / 1000).toFixed(3)}s</h3>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper className={classes.times}>
                                <h3>🥉Bronze</h3>
                                <h3>{(track.bronzeScore / 1000).toFixed(3)}s</h3>
                            </Paper>
                        </Grid>
                    </Grid>
                    <h1 style={{ textAlign: 'center' }}>Leaderboards</h1>
                    <h5 style={{ textAlign: 'center' }}>Coming soon!</h5>
                </>
            )}
        </>
    )
}
