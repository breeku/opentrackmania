import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { getSeasons } from '../../services/seasons'
import { setSeasons } from '../../redux/store/seasons'
import TrackList from '../TrackList'

const useStyles = makeStyles(theme => ({
    seasons: {
        textAlign: 'center',
    },
    season_grid: {
        width: '100%',
        margin: 'auto',
    },
    title: theme.title,
}))

export default function Campaigns() {
    const { seasons } = useSelector(state => state.seasons)
    const dispatch = useDispatch()
    const classes = useStyles()

    React.useEffect(() => {
        const getData = async () => {
            const response = await getSeasons()
            dispatch(setSeasons(response))
        }
        if (!seasons) getData()
    }, [dispatch, seasons])

    return (
        <div className={classes.seasons}>
            <h1 className={classes.title}>Seasons</h1>
            {seasons && (
                <>
                    {seasons.map(season => {
                        return (
                            <>
                                <h2>{season.name}</h2>
                                <Grid
                                    container
                                    className={classes.season_grid}
                                    spacing={6}>
                                    {season.playlist.map(track => {
                                        return <TrackList track={track} />
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
