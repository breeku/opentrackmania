import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'

import { getPlayerTrophies } from '@services/players'

import STrophies from '@components/Player/STrophies'

const useStyles = makeStyles(theme => ({
    trophy: {
        backgroundColor: theme.background_color,
        color: '#fff',
        padding: 3,
        margin: 12,
    },
}))

export default function Trophies({ id }) {
    const [playerTrophies, setPlayerTrophies] = React.useState(null)
    const classes = useStyles()

    React.useEffect(() => {
        const getData = async () => {
            const response = await getPlayerTrophies(id)
            setPlayerTrophies(response)
        }
        getData()
    }, [id])

    return (
        <>
            {!playerTrophies ? (
                <STrophies />
            ) : (
                <>
                    <h3>Trophies</h3>
                    <h6 style={{ padding: 0, margin: 0 }}>
                        Last updated {new Date(playerTrophies.updatedAt).toTimeString()}
                    </h6>
                    <h4>{`Total points: ${playerTrophies.data.points}`}</h4>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 9: ${playerTrophies.data.t9Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 8: ${playerTrophies.data.t8Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 7: ${playerTrophies.data.t7Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 6: ${playerTrophies.data.t6Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 5: ${playerTrophies.data.t5Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 4: ${playerTrophies.data.t4Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 3: ${playerTrophies.data.t3Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 2: ${playerTrophies.data.t2Count}`}</h4>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} className={classes.trophy}>
                                <h4>{`Tier 1: ${playerTrophies.data.t1Count}`}</h4>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    )
}
