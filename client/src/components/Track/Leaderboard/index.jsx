import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Grid, Button, Tooltip } from '@material-ui/core'

import Countdown, { zeroPad } from 'react-countdown'

import { Link } from 'react-router-dom'

import { TwitchIcon } from '@utils/Icons'

const useStyles = makeStyles(theme => ({
    leaderboard: {
        margin: 20,
        marginLeft: 30,
        marginRight: 30,
        padding: 10,
        color: '#fff',
        backgroundColor: theme.background_color,
        display: 'flex',
    },
    color_red: theme.color_red,
    color_green: theme.color_green,
    color_white: theme.color_white,
    color_blue: theme.color_blue,
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
        position: 'absolute',
        left: '5px',
    },
    position_history: {
        color: 'rgba(255,255,255,0.7)',
        position: 'absolute',
        left: '65px',
        cursor: 'default',
    },
    question_mark: {
        position: 'absolute',
        right: '5px',
        fontSize: 13,
    },
    button_download: {
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.23)',
    },
    no_margin_padding: {
        padding: 0,
        margin: 0,
    },
    text_center: { textAlign: 'center' },
    timer: {
        margin: 0,
        padding: 0,
    },
    name: {
        marginLeft: 20,
        marginRight: 10,
    },
    twitch: {
        display: 'flex',
    },
}))

export default function Leaderboard({ leaderboard }) {
    const classes = useStyles()
    const { data } = leaderboard

    return (
        <>
            <h1 className={classes.text_center}>Leaderboards</h1>
            <h6 className={classes.text_center}>
                Last updated {new Date(leaderboard.updatedAt).toTimeString()}
            </h6>
            {leaderboard.closed ? (
                <h4 className={`${classes.text_center} ${classes.color_red}`}>
                    Leaderboards are closed!
                </h4>
            ) : (
                <Countdown
                    date={new Date(leaderboard.updatedAt).getTime() + 900000}
                    renderer={({ minutes, seconds, completed }) => {
                        if (completed) {
                            return (
                                <p className={classes.text_center}>Refresh the page!</p>
                            )
                        } else {
                            return (
                                <h5 className={`${classes.text_center} ${classes.timer}`}>
                                    Next update in: <br />
                                    {zeroPad(minutes)}:{zeroPad(seconds)}
                                </h5>
                            )
                        }
                    }}
                />
            )}
            {data.map((record, i) => {
                const time = new Date(record.score).toISOString().slice(14, -1)
                const oldTime =
                    record.oldScore &&
                    new Date(record.oldScore).toISOString().slice(14, -1)
                return (
                    <Paper className={classes.leaderboard}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={3}>
                                <span className={classes.paper_content}>
                                    <h4 className={classes.position}>
                                        #{record.position}
                                    </h4>
                                    {record.oldScore && record.oldPosition && (
                                        <Tooltip
                                            title={
                                                <>
                                                    Previous time: {oldTime}
                                                    <br />
                                                    Previous position:{' '}
                                                    {record.oldPosition}
                                                </>
                                            }>
                                            <div className={classes.position_history}>
                                                {record.position === record.oldPosition ||
                                                record.stagnant ? (
                                                    <h4>-</h4>
                                                ) : record.position >
                                                  record.oldPosition ? (
                                                    <h5>▲</h5>
                                                ) : (
                                                    record.position <
                                                        record.oldPosition && <h5>▼</h5>
                                                )}
                                            </div>
                                        </Tooltip>
                                    )}

                                    <Link
                                        style={{ textDecoration: 'none' }}
                                        to={`/player/${record.accountId}/stats`}>
                                        <h3
                                            className={`${classes.color_blue} ${classes.name}`}>
                                            {record.nameOnPlatform}
                                        </h3>
                                    </Link>
                                    {record.twitch && (
                                        <a
                                            className={classes.twitch}
                                            href={record.twitch}
                                            target="_blank">
                                            <TwitchIcon height={'16px'} width={'16px'} />
                                        </a>
                                    )}
                                </span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3}>
                                <h4
                                    className={`${classes.paper_content} ${classes.no_margin_padding}`}>
                                    {record.zoneName}
                                </h4>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <span className={classes.paper_content}>
                                    <h2>
                                        {i === 0 ? (
                                            <>{time}</>
                                        ) : (
                                            <>
                                                {time} (
                                                <span className={classes.color_red}>
                                                    +
                                                    {new Date(
                                                        record.score - data[0].score,
                                                    )
                                                        .toISOString()
                                                        .slice(14, -1)}
                                                </span>
                                                <span className={classes.color_white}>
                                                    )
                                                </span>
                                            </>
                                        )}
                                    </h2>
                                </span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2}>
                                <span className={classes.paper_content}>
                                    <Button
                                        href={record.ghost}
                                        target="_blank"
                                        variant="outlined"
                                        color="default"
                                        className={classes.button_download}>
                                        download
                                    </Button>
                                    <a
                                        href="https://www.reddit.com/r/TrackMania/comments/i51q98/download_and_view_wr_ghosts_in_replay_editor/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={classes.question_mark}>
                                        <span role="img" aria-label="question mark">
                                            ❔
                                        </span>
                                    </a>
                                </span>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}
        </>
    )
}
