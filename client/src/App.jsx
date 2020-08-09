import React from 'react'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { AppBar, Toolbar, Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Home from '@components/Home'
import Seasons from '@components/Seasons'
import TrackOfTheDay from '@components/TrackOfTheDay'
import Track from '@components/Track'
import Players from '@components/Players'
import Servers from '@components/Servers'

import Analytics from 'react-router-ga'

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
    link_white: theme.link_white,
    title: theme.title,
    home: {
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
                    <Analytics id="UA-112318085-4">
                        <AppBar position="static">
                            <Toolbar className={classes.appbar}>
                                <div style={{ display: 'flex' }}>
                                    <Grid
                                        container
                                        direction="row"
                                        className={classes.home}>
                                        <Link to="/" className={classes.link_white}>
                                            <h3
                                                className={
                                                    classes.title
                                                }>{`<OPENTRACKMANIA/>`}</h3>
                                        </Link>
                                    </Grid>
                                    <Grid
                                        container
                                        direction="row"
                                        className={classes.buttons}>
                                        <Link
                                            to="/servers"
                                            className={classes.no_decoration}>
                                            <Button className={classes.button}>
                                                servers
                                            </Button>
                                        </Link>

                                        <Link
                                            to="/players"
                                            className={classes.no_decoration}>
                                            <Button className={classes.button}>
                                                players
                                            </Button>
                                        </Link>

                                        <Link
                                            to="/seasons"
                                            className={classes.no_decoration}>
                                            <Button className={classes.button}>
                                                seasons
                                            </Button>
                                        </Link>

                                        <Link
                                            to="/totd"
                                            className={classes.no_decoration}>
                                            <Button className={classes.button}>
                                                track of the day
                                            </Button>
                                        </Link>
                                    </Grid>
                                </div>
                            </Toolbar>
                        </AppBar>
                        <Switch>
                            <Route path="/servers">
                                <Servers />
                            </Route>
                            <Route path="/players">
                                <Players />
                            </Route>
                            <Route path="/seasons">
                                <Seasons />
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
                    </Analytics>
                </Router>
            </div>
        </>
    )
}
