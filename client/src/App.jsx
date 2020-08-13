import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Appbar from '@components/Appbar'
import Footer from '@components/Footer'
import Home from '@components/Home'
import Seasons from '@components/Seasons'
import TrackOfTheDay from '@components/TrackOfTheDay'
import Track from '@components/Track'
import Players from '@components/Players'
import Search from '@components/Players/Search'
import Player from '@components/Player'
import Servers from '@components/Servers'

import Analytics from 'react-router-ga'

const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(13,13,13,1) 100%)',
        color: '#fff',
        minHeight: 'calc(100vh - 2.5em)',
        position: 'relative',
        paddingBottom: '2.5em',
    },
}))

export default function App() {
    const classes = useStyles()

    return (
        <>
            <div className={classes.root}>
                <Router>
                    <Analytics id="UA-112318085-4">
                        <Appbar />

                        <Switch>
                            <Route path="/servers">
                                <Servers />
                            </Route>

                            <Route path="/players" exact={true}>
                                <Players />
                            </Route>
                            <Route path="/players/search/:name">
                                <Search />
                            </Route>
                            <Route path="/player/:id" exact={true}>
                                <Player />
                            </Route>
                            <Route path="/seasons">
                                <Seasons />
                            </Route>
                            <Route path="/totd/">
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
                <Footer />
            </div>
        </>
    )
}
