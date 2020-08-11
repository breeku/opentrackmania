import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '2.5em',
    },
    text: {
        padding: 0,
        margin: 0,
        alignSelf: 'center',
        color: 'rgba(255,255,255,0.5)',
    },
    disclaimer: {
        padding: 0,
        margin: 0,
        alignSelf: 'center',
        color: 'rgba(255,255,255,0.5)',
    },
    seperator: {
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: 'center',
        color: 'rgba(255,255,255,0.5)',
    },
    link: {
        color: 'rgba(0, 140, 253,0.5)',
        textDecoration: 'none',
    },
}))

export default function Footer() {
    const classes = useStyles()

    return (
        <div className={classes.footer}>
            <h6 className={classes.text}>
                <a
                    href="https://github.com/breeku/opentrackmania"
                    target="_blank"
                    className={classes.link}>
                    Github
                </a>
            </h6>
            <span className={classes.seperator}>|</span>
            <h6 className={classes.disclaimer}>
                This is a community made site, and is not associated with Ubisoft or
                Nadeo.
            </h6>
        </div>
    )
}
