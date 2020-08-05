import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    leaderboard: {
        margin: 20,
        marginLeft: 30,
        marginRight: 30,
        padding: 10,
        color: '#fff',
        backgroundColor: '#202020',
        display: 'flex',
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
    paper_content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'relative',
    },
    flex_column: {
        display: 'flex',
        flexDirection: 'column',
    },
    position: {
        color: 'rgba(255,255,255,0.7)',
        marginRight: 10,
        position: 'absolute',
        left: '5px',
    },
}))

export default function Leaderboard({ leaderboard }) {
    const classes = useStyles()
    const { data } = leaderboard
    console.log(data)
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Leaderboards</h1>
            <h6 style={{ textAlign: 'center' }}>
                Last updated at {new Date(leaderboard.updatedAt).toTimeString()}
            </h6>
            {leaderboard.closed && (
                <h4 style={{ textAlign: 'center', color: '#E60000' }}>
                    Leaderboards are closed!
                </h4>
            )}
            {data.map((record, i) => (
                <Paper
                    className={classes.leaderboard}
                    style={{
                        border: leaderboard.closed
                            ? '1px solid rgba(230, 0, 0, 0.15)'
                            : '',
                    }}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={4}>
                            <span className={classes.paper_content}>
                                <h4 className={classes.position}>#{i + 1}</h4>
                                <h3>{record.nameOnPlatform}</h3>
                            </span>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <h4
                                className={classes.paper_content}
                                style={{ padding: 0, margin: 0 }}>
                                {record.zoneName}
                            </h4>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <span className={classes.paper_content}>
                                <h2>
                                    {i === 0 ? (
                                        <>{(record.score / 1000).toFixed(3)}s</>
                                    ) : (
                                        <>
                                            {record.score / 1000}s (
                                            <span className={classes.color_red}>
                                                +
                                                {(
                                                    record.score / 1000 -
                                                    data[0].score / 1000
                                                ).toFixed(3)}
                                            </span>
                                            <span className={classes.color_white}>)</span>
                                        </>
                                    )}
                                </h2>
                            </span>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </>
    )
}
