import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Grid, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'

import { setTrack } from '../../../redux/store/tracks'
import { textParser } from '../../../utils/'
import { useProgressiveImage } from '../../../utils/imageLoader'

export default function List({ totd, classes }) {
    const loaded = useProgressiveImage(totd && totd.map.thumbnailUrl)
    const dispatch = useDispatch()
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Link
                to={{
                    pathname: `/track/${totd.map.mapUid}`,
                }}
                style={{
                    textDecoration: 'none',
                }}
                onClick={() => dispatch(setTrack(totd.map))}>
                <Paper
                    className={classes.TOTD}
                    style={{
                        backgroundImage: loaded && `${`url(${loaded})`}`,
                        opacity: loaded ? '100' : '0',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        transition: 'all 0.5s',
                    }}>
                    <div className={classes.TOTD_cover}>
                        <h4 className={classes.TOTD_date}>
                            {totd.day}/{totd.month}
                        </h4>
                        <h2 className={classes.TOTD_map}>{textParser(totd.map.name)}</h2>
                    </div>
                </Paper>
            </Link>
        </Grid>
    )
}
