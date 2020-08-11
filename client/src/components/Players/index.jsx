import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import MUIDataTable from 'mui-datatables'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    MuiThemeProvider,
    createMuiTheme,
    Paper,
    InputBase,
} from '@material-ui/core'

import { useHistory } from 'react-router-dom'

import { getPlayerRankings } from '@services/players'
import { setPlayers, setPlayer } from '@redux/store/players'

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase)

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: 16,
        minWidth: 120,
    },
    players: {
        textAlign: 'center',
    },
    title: theme.title,
    zonePaper: {
        backgroundColor: theme.background_color,
        padding: 12,
        display: 'inline-flex',
        margin: 6,
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

export default function Players() {
    const { players } = useSelector(state => state.players)
    const [zone, setZone] = React.useState('World')
    const dispatch = useDispatch()
    const classes = useStyles()
    const history = useHistory()

    const data = React.useMemo(
        () => players && players.find(x => x.zoneName === zone).players,
        [players, zone],
    )

    const handleChange = event => {
        setZone(event.target.value)
    }

    React.useEffect(() => {
        const getData = async () => {
            const response = await getPlayerRankings()
            dispatch(setPlayers(response))
        }
        if (!players) getData()
    }, [dispatch, players])

    return (
        <div className={classes.players}>
            <div>
                <h1 className={classes.title}>Players</h1>
            </div>
            {players && (
                <>
                    <Paper className={classes.zonePaper} elevation={3}>
                        <FormControl className={classes.formControl}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ color: '#fff' }}>
                                Zone
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={zone}
                                onChange={handleChange}
                                input={<BootstrapInput />}>
                                {players.map(x => (
                                    <MenuItem
                                        value={
                                            x.zoneName
                                        }>{`${x.zoneName} (${x.players.length})`}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Paper>
                    <MuiThemeProvider theme={theme}>
                        <MUIDataTable
                            columns={[
                                { label: 'Name', name: 'nameOnPlatform' },
                                { label: 'Position', name: 'position' },
                                { label: 'Points', name: 'points' },
                                { label: 'Echelon', name: 'echelon' },
                            ]}
                            data={data}
                            options={{
                                filter: true,
                                selectableRows: 'none',
                                filterType: 'dropdown',
                                responsive: 'vertical',
                                rowsPerPage: 10,
                                download: false,
                                print: false,
                                searchPlaceholder: 'Player name',
                                onRowClick: (d, m) => {
                                    const { accountId, nameOnPlatform } = data[
                                        m.dataIndex
                                    ]
                                    dispatch(setPlayer({ accountId, nameOnPlatform }))
                                    history.push('/player/' + accountId)
                                },
                            }}
                        />
                    </MuiThemeProvider>
                </>
            )}
        </div>
    )
}
