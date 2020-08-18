import React from 'react'

import { useDispatch } from 'react-redux'

import { Link, useHistory } from 'react-router-dom'

import { AppBar, Toolbar, Button, Grid, TextField } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import { searchPlayer } from '@services/players'
import { setPlayer } from '@redux/store/players'
import { setSearchResults } from '@redux/store/search'

const CustomTextField = withStyles({
    root: {
        marginRight: 10,
        '& .MuiFormLabel-root': {
            color: 'rgb(125,125,125)',
        },
        '& .MuiInputBase-root': {
            '& .MuiInputBase-input': {
                color: 'rgb(255,255,255)',
            },
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgb(125,125,125)',
            },
            '&:hover fieldset': {
                borderColor: 'rgb(255,255,255)',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgb(255,255,255)',
            },
        },
    },
})(TextField)

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
    no_decoration: theme.no_decoration,
    link: {
        alignSelf: 'center',
    },
}))

export default function Appbar() {
    const [searchValue, setSearchValue] = React.useState('')
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()

    const handleSubmit = async e => {
        e.preventDefault()
        const players = await searchPlayer(searchValue)
        if (players.length === 0) {
            dispatch(setSearchResults(null))
            history.push('/players/search/' + searchValue)
        } else if (players.length === 1) {
            const player = players[0]
            if (player.nameOnPlatform === searchValue) {
                dispatch(setPlayer(player))
                history.push('/player/' + player.accountId)
            } else {
                dispatch(setSearchResults(players))
                history.push('/players/search/' + searchValue)
            }
        } else {
            dispatch(setSearchResults(players))
            history.push('/players/search/' + searchValue)
        }
    }
    return (
        <AppBar position="static">
            <Toolbar className={classes.appbar}>
                <Grid container direction="row" className={classes.home}>
                    <Link to="/" className={classes.link_white}>
                        <h3 className={classes.title}>{`<OPENTRACKMANIA/>`}</h3>
                    </Link>
                </Grid>
                <Grid container direction="row" className={classes.buttons}>
                    <form onSubmit={handleSubmit}>
                        <CustomTextField
                            id="outlined-basic"
                            label="Search player"
                            variant="outlined"
                            size="small"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                        />
                    </form>
                    <Link
                        to="/servers"
                        className={`${classes.no_decoration} ${classes.link}`}>
                        <Button className={classes.button}>servers</Button>
                    </Link>

                    <Link
                        to="/players"
                        className={`${classes.no_decoration} ${classes.link}`}>
                        <Button className={classes.button}>players</Button>
                    </Link>

                    <Link
                        to="/seasons"
                        className={`${classes.no_decoration} ${classes.link}`}>
                        <Button className={classes.button}>seasons</Button>
                    </Link>

                    <Link
                        to="/totd/tracks"
                        className={`${classes.no_decoration} ${classes.link}`}>
                        <Button className={classes.button}>track of the day</Button>
                    </Link>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
