import React from "react"

import { useDispatch, useSelector } from 'react-redux'

import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'

import { getTOTDStats } from "@services/totds"
import { setTOTDStats } from '@redux/store/totd'

import Construction from "@components/Construction"

const useStyles = makeStyles(theme => ({
    chartContainer: {
        minWidth: 750
    },
    paper: {
        margin: 10,
        padding: 10,
        color: '#fff',
        backgroundColor: theme.background_color,
    }
}))

export default function Stats() {
    const { TOTDstats } = useSelector(state => state.totd)
    const dispatch = useDispatch()
    const classes = useStyles()

    React.useEffect(() => {
        const getData = async () => {
            const response = await getTOTDStats()
            dispatch(setTOTDStats(response))
        }
        if (!TOTDstats) getData()
    }, [TOTDstats, dispatch])

    return (
        <>
        {TOTDstats && 
        <Grid container>
            <Grid item xs={12} sm={6}>
            <Paper className={classes.paper} elevation={3}>
                <h2>Players with most track of the days</h2>
                    <div className={classes.chartContainer}>
                        <ResponsiveContainer width="100%" height={350} style={{overflow: 'auto'}}>
                            <BarChart
                                data={TOTDstats.maps}
                                margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nameOnPlatform" allowDataOverflow={true} interval={0} angle={-45} textAnchor="end" height={120} minTickGap={20}/>
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
            </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.paper} elevation={3}>
                    <h2>Top 10 of players with most top 10 leaderboard finishes</h2>
                        <div className={classes.chartContainer}>
                                    <Construction/>
                        </div>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.paper} elevation={3}>
                    <h2>Top 10 of players with most top 1 leaderboard finishes</h2>
                        <div className={classes.chartContainer}>
                                    <Construction/>
                        </div>
                </Paper>
            </Grid>
        </Grid>
        }
        </>
    )
}