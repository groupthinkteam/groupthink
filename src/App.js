import React from "react"
import PageManager from "./components/PageManager/PageManager"
import { HashRouter } from "react-router-dom"
// import { Provider } from "react-redux"
// import appstore from "./redux/store"

import "./styles.scss"

export default function App() {
    // entry point to the app
    return (
        /* <Provider store={appstore}>
        // </Provider> */
        <HashRouter>
            <PageManager />
        </HashRouter>
    )
}