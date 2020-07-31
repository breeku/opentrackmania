import React from 'react'
import Leaderboards from './components/Leaderboards'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        padding: 10,
        margin: 0,
        background: 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(13,13,13,1) 100%)',
        color: '#fff',
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;`,
        borderRadius: 5,
    },
    text_center: {
        textAlign: 'center',
    },
    footer: {
        textDecoration: 'none',
        color: '#fff',
    },
}))

export default function App() {
    const classes = useStyles()

    React.useEffect(() => {
        document.body.style.backgroundColor = '#0f0f0f'
    }, [])
    return (
        <div className={classes.root}>
            <Leaderboards />
            <div className={classes.text_center}>
                <a
                    className={classes.footer}
                    href="https://github.com/breeku/trackmania-leaderboards">
                    Github
                </a>
            </div>
        </div>
    )
}
