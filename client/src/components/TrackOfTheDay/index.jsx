import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { getTOTDs } from '../../services/totds'

import { groupBy } from '../../utils/'
import { setTOTDs } from '../../redux/store/totd'

import TrackList from '../TrackList'

const useStyles = makeStyles(theme => ({
    TOTDs: {
        textAlign: 'center',
    },

    TOTD_grid: {
        width: '100%',
        margin: 'auto',
    },
    title: { fontWeight: 'lighter', letterSpacing: '2px' },
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
            <h1 className={classes.title}>Track of the day</h1>
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
        </div>
    )
}
