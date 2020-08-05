import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { getTOTDs } from '../../services/totds'

import { groupBy } from '../../utils/'
import { setTOTDs } from '../../redux/store/totd'

import List from './List'

const useStyles = makeStyles(theme => ({
    TOTDs: {
        textAlign: 'center',
    },
    TOTD: {
        minHeight: 150,
        backgroundColor: '#202020',
        color: '#fff',
        height: '100%',
        transition: 'all 0.1s',
        cursor: 'pointer',
        '&:hover': {
            scale: '1.02',
        },
    },
    TOTD_grid: {
        width: '100%',
        margin: 'auto',
    },
    TOTD_date: {
        padding: 0,
        margin: 0,
    },
    TOTD_map: {
        padding: 0,
        margin: 0,
    },
    TOTD_cover: {
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
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

export default function TrackOfTheDay() {
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
            <h1 style={{ fontWeight: 'lighter', letterSpacing: '2px' }}>
                Track of the day
            </h1>
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
                                                return (
                                                    <List totd={totd} classes={classes} />
                                                )
                                            })}
                                    </Grid>
                                </>
                            )
                        })}
                </>
            )}
        </div>
    )
}
