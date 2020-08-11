import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Paper, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { TrendingUp, MoneyOff, GitHub } from '@material-ui/icons'

import { getRandomTOTD } from '@services/totds'
import { setRandomTOTD } from '@redux/store/totd'
import { useProgressiveImage } from '@utils/imageLoader'

const useStyles = makeStyles(theme => ({
    hero: theme.hero,
    background_image: {
        ...theme.background_image,
        backgroundImage: props => props.loaded && `${`url(${props.loaded})`}`,
        opacity: props => (props.loaded ? 100 : 0),
    },
    cover: theme.cover,
    home: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    title: theme.title,
    paper: {
        backgroundColor: theme.background_color,
        margin: 10,
        color: '#fff',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    grid: {
        marginTop: '10vh',
        marginBottom: '10vh',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '6em',
    },
    card_header: {
        margin: 0,
        padding: 0,
    },
    card_content: {
        marginTop: 20,
        padding: 0,
    },
    link_blue: theme.link_blue,
}))

export default function Home() {
    const { randomTOTD } = useSelector(state => state.totd)
    const loaded = useProgressiveImage(randomTOTD && randomTOTD.data.thumbnailUrl)
    const classes = useStyles({ loaded })
    const dispatch = useDispatch()

    React.useEffect(() => {
        const getData = async () => {
            const response = await getRandomTOTD()

            dispatch(setRandomTOTD(response))
        }
        if (!randomTOTD) getData()
    }, [dispatch, randomTOTD])

    return (
        <>
            <Paper className={classes.hero}>
                <div className={classes.background_image} />
                <div className={classes.cover}>
                    <div className={classes.home}>
                        <h1 className={classes.title}>OPENTRACKMANIA</h1>
                    </div>
                </div>
            </Paper>
            <Grid container className={classes.grid}>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <MoneyOff className={classes.icon} elevation={3} />
                        <h4 className={classes.card_header}>Free</h4>
                        <h6 className={classes.card_content}>Free!</h6>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <TrendingUp className={classes.icon} elevation={3} />
                        <h4 className={classes.card_header}>Statistics</h4>
                        <h6 className={classes.card_content}>
                            Track how you or others are doing on the leaderboards
                        </h6>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper} elevation={3}>
                        <GitHub className={classes.icon} />
                        <h4 className={classes.card_header}>Open Source</h4>
                        <h6 className={classes.card_content}>
                            All project code is open source at{' '}
                            <a
                                className={classes.link_blue}
                                href="https://github.com/breeku/opentrackmania"
                                target="_blank">
                                Github
                            </a>
                        </h6>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}
