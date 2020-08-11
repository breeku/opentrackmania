import React from 'react'

import { Link } from 'react-router-dom'

import { AppBar, Toolbar, Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
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
        display: 'flex',
        flexDirection: 'row',
    },
}))

export default function Appbar() {
    const classes = useStyles()
    return (
        <AppBar position="static">
            <Toolbar className={classes.appbar}>
                <Grid container direction="row" className={classes.home}>
                    <Link to="/" className={classes.link_white}>
                        <h3 className={classes.title}>{`<OPENTRACKMANIA/>`}</h3>
                    </Link>
                </Grid>
                <Grid container direction="row" className={classes.buttons}>
                    <Link to="/servers" className={classes.no_decoration}>
                        <Button className={classes.button}>servers</Button>
                    </Link>

                    <Link to="/players" className={classes.no_decoration}>
                        <Button className={classes.button}>players</Button>
                    </Link>

                    <Link to="/seasons" className={classes.no_decoration}>
                        <Button className={classes.button}>seasons</Button>
                    </Link>

                    <Link to="/totd" className={classes.no_decoration}>
                        <Button className={classes.button}>track of the day</Button>
                    </Link>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
