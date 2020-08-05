import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { getRandomTOTD } from '../../services/totds'
import { setRandomTOTD } from '../../redux/store/totd'
import { useProgressiveImage } from '../../utils/imageLoader'

import Construction from '../Construction'

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: '#202020',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight: '40vh',
    },
    hero: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    cover: {
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: 3,
        borderRadius: 4,
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
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
    }, [])

    return (
        <>
            <Paper className={classes.paper}>
                <div
                    className={classes.hero}
                    style={{
                        backgroundImage: loaded && `${`url(${loaded})`}`,
                        opacity: loaded ? '100' : '0',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        filter: 'blur(8px)',
                        transition: 'all 0.5s',
                    }}
                />
                <div className={classes.cover}>
                    <div className={classes.title}>
                        <h1 style={{ fontWeight: 'lighter', letterSpacing: '2px' }}>
                            OPENTRACKMANIA
                        </h1>
                    </div>
                </div>
            </Paper>
            <Construction />
        </>
    )
}
