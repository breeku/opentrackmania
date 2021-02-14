import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams } from 'react-router-dom'

import { Grid, Button, ButtonGroup, Paper } from '@material-ui/core'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { getTOTDs, getTOTDInfo } from '@services/totds'

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
    year_select: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
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

const currYear = new Date().getFullYear()

export default function TrackOfTheDay() {
    const [years, setYears] = React.useState([currYear])
    const [year, setYear] = React.useState(currYear)
    const { selection } = useParams()
    const { TOTDs } = useSelector(state => state.totd)
    const nextYearAvailable = !!years[years.findIndex(y => y === year) + 1]
    const previousYearAvailable = !!years[years.findIndex(y => y === year) - 1]
    const classes = useStyles()
    const dispatch = useDispatch()

    React.useEffect(() => {
        ;(async () => {
            const info = await getTOTDInfo()
            setYears(info.map(item => item.year).sort((a, b) => a - b))
        })()
    }, [])

    React.useEffect(() => {
        ;(async () => {
            const response = await getTOTDs(year)

            const grouped = groupBy(response, 'month')

            dispatch(setTOTDs(grouped))
        })()
    }, [dispatch, year])

    const handleYear = direction => {
        if (TOTDs) dispatch(setTOTDs(null))
        direction === 'forward'
            ? setYear(years[years.findIndex(y => y === year) + 1])
            : setYear(years[years.findIndex(y => y === year) - 1])
    }

    return (
        <div className={classes.TOTDs}>
            <h1 className={classes.title}>Track of the day</h1>
            <div className={classes.year_select}>
                <ArrowBackIos
                    style={{
                        pointerEvents: previousYearAvailable ? 'auto' : 'none',
                        cursor: 'pointer',
                    }}
                    color={previousYearAvailable ? 'inherit' : 'disabled'}
                    onClick={() => handleYear('back')}
                    className={classes.arrow}
                />
                <h2>{year}</h2>
                <ArrowForwardIos
                    style={{
                        pointerEvents: nextYearAvailable ? 'auto' : 'none',
                        cursor: 'pointer',
                    }}
                    color={nextYearAvailable ? 'inherit' : 'disabled'}
                    onClick={() => handleYear('forward')}
                    className={classes.arrow}
                />
            </div>
            {/* 
            <Paper className={classes.paper} elevation={3}>
                <ButtonGroup
                    className={classes.buttons}
                    aria-label="text primary button group">
                        
                    {options.map(option => (
                        <Link to={option} className={classes.no_decoration}>
                            <Button
                                disabled
                                color="primary"
                                style={{ color: '#fff' }}
                                variant={option === selection ? 'outlined' : 'text'}>
                                {option}
                            </Button>
                        </Link>
                    ))}
                </ButtonGroup>
            </Paper>
            */}

            {selection === 'tracks' && (
                <>
                    {TOTDs && (
                        <>
                            {Array.from(Object.keys(TOTDs))
                                .sort((a, b) => b - a)
                                .map(month => {
                                    return (
                                        <div key={month}>
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
                                                        return (
                                                            <TrackList
                                                                key={totd.id}
                                                                track={totd}
                                                            />
                                                        )
                                                    })}
                                            </Grid>
                                        </div>
                                    )
                                })}
                        </>
                    )}
                </>
            )}
            {/* {selection === 'stats' && <Stats />} */}
        </div>
    )
}
