import React from 'react'

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { getLeaderboards } from '../../services/leaderboards'

const useStyles = makeStyles(theme => ({
    leaderboards: {
        textAlign: 'center',
    },
    accordion: {
        backgroundColor: '#1e1e1e',
        padding: 10,
        margin: 20,
        borderRadius: 3,
        color: '#fff',
    },
    accordion_summary: {
        display: 'block',
    },
    flex_column: {
        display: 'flex',
        flexDirection: 'column',
    },
    paper: {
        borderRadius: 6,
        paddingTop: 10,
        paddingTopBottom: 10,
        margin: 10,
        backgroundColor: '#202020',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        '&::after': {
            content: `''`,
        },
        '&::before': {
            content: `''`,
        },
    },
    paper_content: {
        flex: '0 0 30%',
        display: 'inline-flex',
    },
    position: {
        color: 'rgba(255,255,255,0.7)',
        marginRight: 10,
    },
    top_records: {
        alignSelf: 'center',
        width: '50%',
        paddingRight: '5%',
        paddingLeft: '5%',
    },
    color_red: {
        color: '#E60000',
    },
    color_green: {
        color: '#44be00',
    },
    color_white: {
        color: '#fff',
    },
    loading_container: {
        minHeight: '80vh',
    },
}))

const getTopTen = leaderboards => {
    let result = []
    const maps = leaderboards.flatMap(x => x.data)

    const names = maps.flatMap(x => x.nameOnPlatform)
    const regions = maps.flatMap(x => x.zoneName)

    let players = []
    let zones = []
    for (const nameOnPlatform of names) {
        // change this to reduce
        if (!players.find(x => x.nameOnPlatform === nameOnPlatform)) {
            const count = names.filter(x => x === nameOnPlatform).length
            players.push({ nameOnPlatform, count })
        }
    }

    for (const zone of regions) {
        // change this to reduce
        if (!zones.find(x => x.zone === zone)) {
            const count = regions.filter(x => x === zone).length
            zones.push({ zone, count })
        }
    }

    players.sort((a, b) => b.count - a.count)
    zones.sort((a, b) => b.count - a.count)

    return { players: players.slice(0, 10), zones: zones.slice(0, 10) }
}

export default function Leaderboard() {
    const [leaderboards, setLeaderboards] = React.useState(null)
    const classes = useStyles()
    React.useEffect(() => {
        const getData = async () => {
            const response = await getLeaderboards()
            setLeaderboards(response)
        }

        getData()
    }, [])

    const topTen = React.useMemo(() => {
        return leaderboards && getTopTen(leaderboards)
    }, [leaderboards])
    return (
        <div className={classes.leaderboards}>
            <h1 style={{ fontWeight: 'lighter', letterSpacing: '2px' }}>Leaderboards</h1>
            {topTen === null ? (
                <div className={classes.loading_container}></div>
            ) : (
                <>
                    {leaderboards.length === 0 ? (
                        <></>
                    ) : (
                        <>
                            <h2>{leaderboards[0].campaign}</h2>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Accordion className={classes.accordion}>
                                        <AccordionSummary
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            classes={{
                                                content: classes.accordion_summary,
                                            }}>
                                            <h3>Players with most top 10 records</h3>
                                        </AccordionSummary>

                                        <AccordionDetails className={classes.flex_column}>
                                            {topTen.players.map(x => {
                                                const { nameOnPlatform, count } = x
                                                return (
                                                    <Paper
                                                        elevation={3}
                                                        className={`${classes.paper} ${classes.top_records}`}>
                                                        <h3>
                                                            {nameOnPlatform} has{' '}
                                                            <span
                                                                className={
                                                                    classes.color_green
                                                                }>
                                                                {count}
                                                            </span>{' '}
                                                            records!
                                                        </h3>
                                                    </Paper>
                                                )
                                            })}
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Accordion className={classes.accordion}>
                                        <AccordionSummary
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            classes={{
                                                content: classes.accordion_summary,
                                            }}>
                                            <h3>Zones with most top 10 records</h3>
                                        </AccordionSummary>

                                        <AccordionDetails className={classes.flex_column}>
                                            {topTen.zones.map(x => {
                                                const { zone, count } = x
                                                return (
                                                    <Paper
                                                        elevation={3}
                                                        className={`${classes.paper} ${classes.top_records}`}>
                                                        <h3>
                                                            {zone} has{' '}
                                                            <span
                                                                className={
                                                                    classes.color_green
                                                                }>
                                                                {count}
                                                            </span>{' '}
                                                            records!
                                                        </h3>
                                                    </Paper>
                                                )
                                            })}
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                            <Grid container>
                                {Array.from(leaderboards)
                                    .sort((a, b) => a.id - b.id)
                                    .map((leaderboard, i) => {
                                        console.log(leaderboard)
                                        return (
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <Accordion
                                                        className={classes.accordion}>
                                                        <AccordionSummary
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                            classes={{
                                                                content:
                                                                    classes.accordion_summary,
                                                            }}>
                                                            <h3>{i + 1}</h3>
                                                        </AccordionSummary>

                                                        {leaderboard.data.map(
                                                            (map, i) => (
                                                                <AccordionDetails
                                                                    className={
                                                                        classes.flex_column
                                                                    }>
                                                                    <Paper
                                                                        elevation={3}
                                                                        className={
                                                                            classes.paper
                                                                        }>
                                                                        <Grid
                                                                            container
                                                                            direction="row">
                                                                            <Grid
                                                                                item
                                                                                xs={12}
                                                                                sm={12}
                                                                                md={4}>
                                                                                <span
                                                                                    className={
                                                                                        classes.paper_content
                                                                                    }>
                                                                                    <h4
                                                                                        className={
                                                                                            classes.position
                                                                                        }>
                                                                                        #
                                                                                        {i +
                                                                                            1}
                                                                                    </h4>
                                                                                    <h3>
                                                                                        {
                                                                                            map.nameOnPlatform
                                                                                        }
                                                                                    </h3>
                                                                                </span>
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={12}
                                                                                sm={12}
                                                                                md={4}>
                                                                                <h4
                                                                                    className={
                                                                                        classes.paper_content
                                                                                    }>
                                                                                    {
                                                                                        map.zoneName
                                                                                    }
                                                                                </h4>
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={12}
                                                                                sm={12}
                                                                                md={4}>
                                                                                <span
                                                                                    className={
                                                                                        classes.paper_content
                                                                                    }>
                                                                                    <h2>
                                                                                        {i ===
                                                                                        0 ? (
                                                                                            <>
                                                                                                {(
                                                                                                    map.score /
                                                                                                    1000
                                                                                                ).toFixed(
                                                                                                    3,
                                                                                                )}

                                                                                                s
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                {map.score /
                                                                                                    1000}

                                                                                                s
                                                                                                (
                                                                                                <span
                                                                                                    className={
                                                                                                        classes.color_red
                                                                                                    }>
                                                                                                    +
                                                                                                    {(
                                                                                                        map.score /
                                                                                                            1000 -
                                                                                                        leaderboard
                                                                                                            .data[0]
                                                                                                            .score /
                                                                                                            1000
                                                                                                    ).toFixed(
                                                                                                        3,
                                                                                                    )}
                                                                                                </span>
                                                                                                <span
                                                                                                    className={
                                                                                                        classes.color_white
                                                                                                    }>
                                                                                                    )
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                    </h2>
                                                                                </span>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Paper>
                                                                </AccordionDetails>
                                                            ),
                                                        )}
                                                    </Accordion>
                                                </Grid>
                                            </>
                                        )
                                    })}
                            </Grid>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
