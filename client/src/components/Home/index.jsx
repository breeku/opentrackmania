import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { getRandomTOTD } from '../../services/totds'
import { setRandomTOTD } from '../../redux/store/totd'
import { useProgressiveImage } from '../../utils/imageLoader'

import Construction from '../Construction'

const useStyles = makeStyles(theme => ({
    hero: theme.hero,
    background_image: theme.background_image,
    cover: theme.cover,
    home: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    title: {
        fontWeight: 'lighter',
        letterSpacing: '2px',
    },
}))

export default function Home() {
    const { randomTOTD } = useSelector(state => state.totd)
    const loaded = useProgressiveImage(randomTOTD && randomTOTD.data.thumbnailUrl)
    const classes = useStyles()
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
                <div
                    className={classes.background_image}
                    style={{
                        backgroundImage: loaded && `${`url(${loaded})`}`,
                        opacity: loaded ? '100' : '0',
                    }}
                />
                <div className={classes.cover}>
                    <div className={classes.home}>
                        <h1 className={classes.title}>OPENTRACKMANIA</h1>
                    </div>
                </div>
            </Paper>
            <Construction />
        </>
    )
}
