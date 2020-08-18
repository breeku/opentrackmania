import React from 'react'

import { useSelector } from 'react-redux'

import { useParams, Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    search: {
        textAlign: 'center',
    },
    paper: {
        display: 'flex',
        minWidth: 100,
        padding: 10,
        margin: 10,
        color: '#fff',
        backgroundColor: theme.background_color,
        alignSelf: 'center',
        '&:hover': {
            scale: '1.02',
        },
    },
    link: {
        ...theme.no_decoration,
        ...theme.color_white,
    },
}))

export default function Search() {
    const { results } = useSelector(state => state.search)
    const { name } = useParams()
    const classes = useStyles()
    return (
        <div className={classes.search}>
            {!results ? (
                <>
                    <h4>There were no matches for "{name}".</h4>
                    <h5>
                        At the moment only way to get tracked is to get a top 10
                        leaderboard record.
                    </h5>
                </>
            ) : (
                <>
                    <h4>Nothing quite matched "{name}".</h4>
                    <h5>These were found, though</h5>
                    <Grid container direction="column">
                        {results.map(account => (
                            <Paper className={classes.paper} elevation={3}>
                                <Grid item xs={12} sm={12}>
                                    <Link
                                        className={classes.link}
                                        to={`/player/${account.accountId}/stats`}>
                                        {account.nameOnPlatform}
                                    </Link>
                                </Grid>
                            </Paper>
                        ))}
                    </Grid>
                </>
            )}
        </div>
    )
}
