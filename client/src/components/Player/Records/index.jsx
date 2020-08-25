import React from 'react'

import { useDispatch } from 'react-redux'

import { useHistory } from 'react-router-dom'

import MUIDataTable from 'mui-datatables'
import { makeStyles } from '@material-ui/core/styles'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'

import { getPlayerRecords } from '@services/players'
import { textParser } from '@utils'
import { setTrack } from '@redux/store/tracks'

const useStyles = makeStyles(theme => ({
    records: {
        width: '100%',
    },
}))

const theme = createMuiTheme({
    palette: { type: 'dark', background: 'rgba(0,0,0,0.35)' },
    overrides: {
        MUIDataTableBodyCell: {
            root: {
                cursor: 'pointer',
            },
        },
    },
})

export default function Records({ id }) {
    const [playerRecords, setPlayerRecords] = React.useState(null)
    const history = useHistory()
    const dispatch = useDispatch()
    const classes = useStyles()

    React.useEffect(() => {
        const getData = async () => {
            const response = await getPlayerRecords(id)
            setPlayerRecords(response)
        }
        getData()
    }, [id])

    return (
        <>
            {playerRecords && (
                <div className={classes.records}>
                    <h3>Records</h3>
                    <h6 style={{ padding: 0, margin: 0 }}>
                        Records found: {playerRecords.length}
                    </h6>

                    <MuiThemeProvider theme={theme}>
                        <MUIDataTable
                            columns={[
                                {
                                    label: 'Track',
                                    name: 'track',
                                    options: {
                                        sort: false,
                                        customBodyRenderLite: dataIndex => {
                                            return textParser(
                                                playerRecords[dataIndex].map.data.name,
                                            )
                                        },
                                    },
                                },
                                {
                                    label: 'Position',
                                    name: 'data',
                                    options: {
                                        sort: true,
                                        customBodyRenderLite: dataIndex => {
                                            return playerRecords[dataIndex].leaderboard
                                                .position
                                        },
                                        sortCompare: order => {
                                            return (obj1, obj2) => {
                                                let val1 = parseInt(
                                                    obj1.data.position,
                                                    10,
                                                )
                                                let val2 = parseInt(
                                                    obj2.data.position,
                                                    10,
                                                )
                                                return (
                                                    (val1 - val2) *
                                                    (order === 'asc' ? 1 : -1)
                                                )
                                            }
                                        },
                                    },
                                },
                                {
                                    label: 'Time',
                                    name: 'time',
                                    options: {
                                        sort: false,
                                        customBodyRenderLite: dataIndex => {
                                            return new Date(
                                                playerRecords[
                                                    dataIndex
                                                ].leaderboard.score,
                                            )
                                                .toISOString()
                                                .slice(14, -1)
                                        },
                                    },
                                },
                                {
                                    label: 'Created',
                                    name: 'created',
                                    options: {
                                        sort: false,
                                        customBodyRenderLite: dataIndex => {
                                            return new Date(
                                                Date.parse(
                                                    playerRecords[dataIndex].leaderboard
                                                        .createdAt,
                                                ),
                                            ).toDateString()
                                        },
                                    },
                                },
                            ]}
                            data={playerRecords}
                            options={{
                                filter: true,
                                selectableRows: 'none',
                                filterType: 'dropdown',
                                responsive: 'vertical',
                                rowsPerPage: 10,
                                download: false,
                                print: false,
                                search: false,
                                onRowClick: (d, m) => {
                                    dispatch(
                                        setTrack(playerRecords[m.dataIndex].map.data),
                                    )
                                    history.push(
                                        '/track/' + playerRecords[m.dataIndex].map.mapUid,
                                    )
                                },
                            }}
                        />
                    </MuiThemeProvider>
                </div>
            )}
        </>
    )
}
