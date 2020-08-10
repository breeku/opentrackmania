import React from 'react'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: '#202020',
        position: 'relative',
        overflow: 'hidden',
        margin: 'auto',
        marginTop: 30,
        marginBottom: 30,
        color: '#fff',
        height: 'max-content',
        width: 'max-content',
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
}))

export default function Construction() {
    const classes = useStyles()
    return (
        <Paper className={classes.paper} elevation={4}>
            <h3>
                <span role="img" aria-label="construction">
                    🚧
                </span>{' '}
                Under construction{' '}
                <span role="img" aria-label="construction">
                    🚧
                </span>
            </h3>
            <h4>
                Check out progress at{' '}
                <a
                    style={{ textDecoration: 'none', color: '#004687' }}
                    href="https://github.com/breeku/opentrackmania">
                    Github
                </a>
            </h4>
        </Paper>
    )
}
