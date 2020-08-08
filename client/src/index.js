import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './root.css'
import { Provider } from 'react-redux'
import store from './redux/store'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
    hero: {
        backgroundColor: '#202020',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight: '40vh',
    },
    background_image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        filter: 'blur(8px)',
        transition: 'all 0.5s',
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
        fontWeight: 'lighter',
        letterSpacing: '2px',
    },
    no_decoration: {
        textDecoration: 'none',
    },
    link_white: {
        textDecoration: 'none',
        color: '#fff',
    },
    color_red: {
        color: '#E60000',
    },
    color_green: {
        color: '#44be00',
    },
    color_white: {
        color: '#fff',
    },
})

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
)
