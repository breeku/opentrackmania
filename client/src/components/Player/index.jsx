import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid, ButtonGroup, Button } from '@material-ui/core'

import {
    LineChart,
    Line,
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'

import { setPlayerRanking, setPlayer } from '@redux/store/players'
import { getPlayerRanking, getPlayer } from '@services/players'

import Construction from '@components/Construction'

const useStyles = makeStyles(theme => ({
    player: {
        textAlign: 'center',
    },
    title: theme.title,
    paper: {
        display: 'flex',
        justifyContent: 'center',
        margin: 30,
        color: '#fff',
        backgroundColor: theme.background_color,
        flexDirection: 'column',
        alignItems: 'center',
    },
    chart: {
        minWidth: '90%',
        padding: 15,
        margin: 15,
        backgroundColor: theme.background_color,
    },
}))

export default function Player() {
    const [zoneName, setZoneName] = React.useState('World')
    const { player, playerRanking } = useSelector(state => state.players)
    const { id } = useParams()
    const dispatch = useDispatch()
    const classes = useStyles()

    const rankings = React.useMemo(
        () =>
            playerRanking &&
            playerRanking.flatMap(ranking => {
                const zone = ranking.zones.find(zone => zone.zoneName === zoneName)
                if (zone) {
                    const date = new Date(ranking.createdAt)
                    return {
                        zone: {
                            ...zone,
                            timestamp:
                                date.getDate() +
                                '.' +
                                (date.getMonth() + 1) +
                                '.' +
                                date.getFullYear(),
                        },
                    }
                } else {
                    return []
                }
            }),
        [playerRanking, zoneName],
    )

    React.useEffect(() => {
        const getData = async () => {
            if (!player || (player && player.accountId !== id)) {
                const response = await getPlayer(id)
                dispatch(setPlayer(response))
            }
            const response = await getPlayerRanking(id)
            dispatch(setPlayerRanking(response))
        }

        getData()
    }, [dispatch, id, player])

    return (
        <div className={classes.player}>
            {player && playerRanking && (
                <>
                    <div>
                        <h1 className={classes.title}>{player.nameOnPlatform}</h1>
                    </div>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper} elevation={3}>
                                <h3>Rankings</h3>
                                <ButtonGroup
                                    color="primary"
                                    aria-label="text primary button group">
                                    {playerRanking[0].zones.map(zone => (
                                        <Button
                                            style={{ color: '#fff' }}
                                            variant={
                                                zone.zoneName === zoneName
                                                    ? 'outlined'
                                                    : 'text'
                                            }
                                            onClick={() => setZoneName(zone.zoneName)}>
                                            {zone.zoneName}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                                <Paper className={classes.chart} elevation={3}>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart
                                            data={rankings}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 20,
                                                bottom: 20,
                                            }}>
                                            <Line
                                                type="monotone"
                                                dataKey="zone.ranking.position"
                                                stroke="#8884d8"
                                            />
                                            <CartesianGrid
                                                stroke="rgba(255,255,255,0.3)"
                                                strokeDasharray="5 5"
                                            />
                                            <XAxis dataKey="zone.timestamp" />
                                            <YAxis
                                                allowDecimals={false}
                                                domain={[
                                                    Math.round(
                                                        Math.min.apply(
                                                            Math,
                                                            rankings.map(o => {
                                                                return o.zone.ranking
                                                                    .position
                                                            }),
                                                        ) * 0.5,
                                                    ),
                                                    Math.round(
                                                        Math.max.apply(
                                                            Math,
                                                            rankings.map(o => {
                                                                return o.zone.ranking
                                                                    .position
                                                            }),
                                                        ) * 1.5,
                                                    ),
                                                ]}
                                            />
                                            <Tooltip />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper} elevation={3}>
                                <h3>Records</h3>
                                <Construction />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper} elevation={3}>
                                <h3>Activity</h3>
                                <Construction />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper} elevation={3}>
                                <h3>Replays</h3>
                                <Construction />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper} elevation={3}>
                                <h3>Trophies</h3>
                                <Construction />
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </div>
    )
}
