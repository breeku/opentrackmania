import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { AppBar, Toolbar, Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Home from './components/Home'
import Leaderboards from './components/Leaderboards'
import TrackOfTheDay from './components/TrackOfTheDay'
import Track from './components/Track'

const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(13,13,13,1) 100%)',
        color: '#fff',
        minHeight: '100vh',
    },
    footer: {
        textAlign: 'center',
        position: 'fixed',
        left: 0,
        bottom: 5,
        width: '100%',
    },
    no_decoration: {
        textDecoration: 'none',
        color: '#fff',
    },
    title: {
        justifyContent: 'flex-start',
        alignSelf: 'center',
    },
    buttons: {
        justifyContent: 'flex-end',
        alignSelf: 'center',
    },
    button: {
        color: '#fff',
        marginLeft: 5,
        marginRight: 5,
    },
    appbar: {
        background: 'linear-gradient(360deg, rgba(18,18,18,1) 0%, rgba(13,13,13,1) 100%)',
        display: 'grid',
        flexDirection: 'row',
    },
}))

export default function App() {
    const classes = useStyles()

    return (
        <>
            <div className={classes.root}>
                <Router>
                    <AppBar position="static">
                        <Toolbar className={classes.appbar}>
                            <div style={{ display: 'flex' }}>
                                <Grid container direction="row" className={classes.title}>
                                    <Link to="/" className={classes.no_decoration}>
                                        <h3
                                            style={{
                                                fontWeight: 'lighter',
                                                letterSpacing: '2px',
                                            }}>{`<OPENTRACKMANIA/>`}</h3>
                                    </Link>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    className={classes.buttons}>
                                    <Link
                                        to="/leaderboards"
                                        className={classes.no_decoration}>
                                        <Button className={classes.button}>
                                            leaderboards
                                        </Button>
                                    </Link>

                                    <Link to="/totd" className={classes.no_decoration}>
                                        <Button className={classes.button}>
                                            track of the day
                                        </Button>
                                    </Link>
                                </Grid>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <Switch>
                        <Route path="/leaderboards">
                            <Leaderboards />
                        </Route>
                        <Route path="/totd/" exact={true}>
                            <TrackOfTheDay />
                        </Route>
                        <Route path="/track/:id">
                            <Track />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </>
    )
}
