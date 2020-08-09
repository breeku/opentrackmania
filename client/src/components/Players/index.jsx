import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles'

import { getPlayers } from '@services/players'
import { setPlayers } from '@redux/store/players'

const useStyles = makeStyles(theme => ({
    players: {
        textAlign: 'center',
    },
    title: theme.title,
}))

export default function Players() {
    const { players } = useSelector(state => state.players)
    const dispatch = useDispatch()
    const classes = useStyles()

    React.useEffect(() => {
        const getData = async () => {
            const response = await getPlayers()
            dispatch(setPlayers(response))
        }
        if (!players) getData()
    }, [dispatch, players])
    console.log(players)
    return (
        <div className={classes.players}>
            <h1 className={classes.title}>Players</h1>
            {players && (
                <MaterialTable
                    columns={[
                        { title: 'Name', field: 'nameOnPlatform' },
                        { title: 'Points', field: 'countPoint', type: 'numeric' },
                        { title: 'Echelon', field: 'countPoint', type: 'numeric' },
                    ]}
                    data={players}
                    title="Demo Title"
                />
            )}
        </div>
    )
}
