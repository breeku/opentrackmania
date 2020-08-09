import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useLocation, useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid } from '@material-ui/core'

import { textParser } from '@utils/'
import { getLeaderboard } from '@services/leaderboards'
import { getTrack } from '@services/tracks'
import { setTrack } from '@redux/store/tracks'
import { useProgressiveImage } from '@utils/imageLoader'

import SLeaderboard from './SLeaderboard'
import Leaderboard from './Leaderboard'

const useStyles = makeStyles(theme => ({
    hero: theme.hero,
    background_image: theme.background_image,
    cover: theme.cover,
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
    text_center: { textAlign: 'center' },
}))

export default function Track() {
    const [leaderboard, setLeaderboard] = React.useState(null)
    const { track } = useSelector(state => state.tracks)
    const dispatch = useDispatch()
    const classes = useStyles()
    const { pathname } = useLocation()
    const { id } = useParams()
    const loaded = useProgressiveImage(track && track.thumbnailUrl)

    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    React.useEffect(() => {
        const getData = async () => {
            const response = await getTrack(id)
            dispatch(setTrack(response.data))
        }

        if (!track) getData()
    }, [dispatch, id, track])

    React.useEffect(() => {
        const getData = async () => {
            setLeaderboard(await getLeaderboard(track.mapUid))
        }

        if (!leaderboard && track) getData()
    }, [track, leaderboard])

    return (
        <>
            {track && (
                <>
                    <Paper className={classes.hero}>
                        <div
                            className={classes.background_image}
                            style={{
                                backgroundImage: loaded && `${`url(${loaded})`}`,
                                opacity: loaded ? '100' : '0',
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
                                <h1 className={classes.text_center}>Trophies</h1>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    align="center">
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>
                                                <span role="img" aria-label="trophy">
                                                    🏆
                                                </span>
                                                Author
                                            </h3>
                                            <h3>
                                                {(track.authorScore / 1000).toFixed(3)}s
                                            </h3>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>
                                                <span role="img" aria-label="gold">
                                                    🥇
                                                </span>
                                                Gold
                                            </h3>
                                            <h3>
                                                {(track.goldScore / 1000).toFixed(3)}s
                                            </h3>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>
                                                <span role="img" aria-label="silver">
                                                    🥈
                                                </span>
                                                Silver
                                            </h3>
                                            <h3>
                                                {(track.silverScore / 1000).toFixed(3)}s
                                            </h3>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper className={classes.times}>
                                            <h3>
                                                <span role="img" aria-label="bronze">
                                                    🥉
                                                </span>
                                                Bronze
                                            </h3>
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
