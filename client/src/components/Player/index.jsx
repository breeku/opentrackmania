import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Link, useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid, ButtonGroup, Button } from '@material-ui/core'

import { setPlayer } from '@redux/store/players'
import { getPlayer } from '@services/players'

import Construction from '@components/Construction'
import Rankings from './Rankings'
import Trophies from './Trophies'
import Records from './Records'

const useStyles = makeStyles(theme => ({
    player: {
        textAlign: 'center',
    },
    title: theme.title,
    paper: {
        display: 'flex',
        justifyContent: 'center',
        margin: 30,
        color: '#fff',
        backgroundColor: theme.background_color,
        flexDirection: 'column',
        alignItems: 'center',
    },
    chart: {
        minWidth: '90%',
        padding: 15,
        margin: 15,
        backgroundColor: theme.background_color,
    },
    paper_buttons: {
        display: 'inline-flex',
        justifyContent: 'center',
        margin: 10,
        padding: 10,
        color: '#fff',
        backgroundColor: theme.background_color,
    },
}))

const options = ['stats', 'records', 'maps', 'activity', 'replays']

export default function Player() {
    const { selection } = useParams()
    const { player } = useSelector(state => state.players)
    const { id } = useParams()
    const dispatch = useDispatch()
    const classes = useStyles()

    React.useEffect(() => {
        const getData = async () => {
            if (!player || (player && player.accountId !== id)) {
                const response = await getPlayer(id)
                dispatch(setPlayer(response))
            }
        }

        getData()
    }, [dispatch, id, player])

    return (
        <div className={classes.player}>
            {player && (
                <>
                    <div>
                        <h1 className={classes.title}>{player.nameOnPlatform}</h1>
                    </div>
                    <Paper className={classes.paper_buttons} elevation={3}>
                        <ButtonGroup
                            className={classes.buttons}
                            aria-label="text primary button group">
                            {options.map(option => (
                                <Link to={option}>
                                    <Button
                                        color="primary"
                                        style={{ color: '#fff' }}
                                        variant={
                                            option === selection ? 'outlined' : 'text'
                                        }>
                                        {option}
                                    </Button>
                                </Link>
                            ))}
                        </ButtonGroup>
                    </Paper>
                    <Grid container>
                        {selection === 'stats' && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <Paper className={classes.paper} elevation={3}>
                                        <Rankings id={id} />
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Paper className={classes.paper} elevation={3}>
                                        <Trophies id={id} />
                                    </Paper>
                                </Grid>
                            </>
                        )}
                        {selection === 'records' && (
                            <>
                                <Grid item xs={12} sm={12}>
                                    <Paper className={classes.paper} elevation={3}>
                                        <Records id={id} />
                                    </Paper>
                                </Grid>
                            </>
                        )}
                        {selection === 'maps' && (
                            <>
                                <Grid item xs={12} sm={12}>
                                    <Paper className={classes.paper} elevation={3}>
                                        <h3>Maps</h3>
                                        <Construction />
                                    </Paper>
                                </Grid>
                            </>
                        )}
                        {selection === 'activity' && (
                            <>
                                <Grid item xs={12} sm={12}>
                                    <Paper className={classes.paper} elevation={3}>
                                        <h3>Activity</h3>
                                        <Construction />
                                    </Paper>
                                </Grid>
                            </>
                        )}
                        {selection === 'replays' && (
                            <>
                                <Grid item xs={12} sm={12}>
                                    <Paper className={classes.paper} elevation={3}>
                                        <h3>Replays</h3>
                                        <Construction />
                                    </Paper>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </>
            )}
        </div>
    )
}
