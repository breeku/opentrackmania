import React from 'react'

import { Redirect } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { useLocation } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid } from '@material-ui/core'

import { textParser } from '../../utils/'
import { getLeaderboard } from '../../services/leaderboards'

import SLeaderboard from './SLeaderboard'
import Leaderboard from './Leaderboard'

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
        marginTop: 10,
        padding: 10,
        width: '50%',
        margin: 'auto',
    },
    leaderboard: {
        backgroundColor: '#111',
        padding: 5,
        marginLeft: 7,
        marginBottom: 7,
        color: '#fff',
    },
    trophies: {
        backgroundColor: '#111',
        padding: 5,
        marginRight: 7,
        color: '#fff',
    },
}))

export default function Track() {
    const [leaderboard, setLeaderboard] = React.useState(null)
    const { track } = useSelector(state => state.tracks)
    const classes = useStyles()
    const { pathname } = useLocation()

    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    React.useEffect(() => {
        const getData = async () => {
            setLeaderboard(await getLeaderboard(track.mapUid))
        }

        if (!leaderboard && track) getData()
    }, [])

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
                    <Grid container>
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.trophies} elevation={5}>
                                <h1 style={{ textAlign: 'center' }}>Trophies</h1>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    align="center">
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>🏆Author</h3>
                                            <h3>
                                                {(track.authorScore / 1000).toFixed(3)}s
                                            </h3>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>🥇Gold</h3>
                                            <h3>
                                                {(track.goldScore / 1000).toFixed(3)}s
                                            </h3>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>🥈Silver</h3>
                                            <h3>
                                                {(track.silverScore / 1000).toFixed(3)}s
                                            </h3>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>🥉Bronze</h3>
                                            <h3>
                                                {(track.bronzeScore / 1000).toFixed(3)}s
                                            </h3>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Paper className={classes.leaderboard} elevation={5}>
                                {!leaderboard ? (
                                    <SLeaderboard />
                                ) : (
                                    <Leaderboard leaderboard={leaderboard} />
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    )
}
