import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams } from 'react-router-dom'

import { Grid, Button, ButtonGroup, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { getTOTDs } from '@services/totds'

import { groupBy } from '@utils/'
import { setTOTDs } from '@redux/store/totd'

import TrackList from '@components/TrackList'
import Stats from './Stats'

const useStyles = makeStyles(theme => ({
    TOTDs: {
        textAlign: 'center',
    },

    TOTD_grid: {
        width: '100%',
        margin: 'auto',
    },
    title: theme.title,
    paper: {
        display: 'inline-flex',
        justifyContent: 'center',
        margin: 10,
        padding: 10,
        color: '#fff',
        backgroundColor: theme.background_color,
    },
    no_decoration: theme.no_decoration,
}))

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

const options = ['tracks', 'stats']

export default function TrackOfTheDay() {
    const { selection } = useParams()
    const { TOTDs } = useSelector(state => state.totd)
    const classes = useStyles()
    const dispatch = useDispatch()

    React.useEffect(() => {
        const getData = async () => {
            const response = await getTOTDs()
            const grouped = groupBy(response, 'month')

            dispatch(setTOTDs(grouped))
        }

        if (!TOTDs) getData()
    }, [TOTDs, dispatch])

    return (
        <div className={classes.TOTDs}>
            <h1 className={classes.title}>Track of the day</h1>
            <Paper className={classes.paper} elevation={3}>
                <ButtonGroup
                    className={classes.buttons}
                    aria-label="text primary button group">
                    {options.map(option => (
                        <Link to={option} className={classes.no_decoration}>
                            <Button
                                color="primary"
                                style={{ color: '#fff' }}
                                variant={option === selection ? 'outlined' : 'text'}>
                                {option}
                            </Button>
                        </Link>
                    ))}
                </ButtonGroup>
            </Paper>
            {selection === 'tracks' && (
                <>
                    {TOTDs && (
                        <>
                            {Array.from(Object.keys(TOTDs))
                                .sort((a, b) => b - a)
                                .map(month => {
                                    return (
                                        <>
                                            <h2>{monthNames[month - 1]}</h2>
                                            <Grid
                                                container
                                                className={classes.TOTD_grid}
                                                spacing={6}>
                                                {Array.from(TOTDs[month])
                                                    .sort((a, b) =>
                                                        a.day < b.day
                                                            ? 1
                                                            : b.day < a.day
                                                            ? -1
                                                            : 0,
                                                    )
                                                    .map(totd => {
                                                        return <TrackList track={totd} />
                                                    })}
                                            </Grid>
                                        </>
                                    )
                                })}
                        </>
                    )}
                </>
            )}
            {selection === 'stats' && <Stats />}
        </div>
    )
}
