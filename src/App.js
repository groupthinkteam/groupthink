import React from "react"
import PageManager from "./components/PageManager/PageManager"

// import { Provider } from "react-redux"
// import appstore from "./redux/store"

import "./styles.scss"
import { BrowserRouter } from "react-router-dom"

export default function App() {
    // entry point to the app
    return (
        /* <Provider store={appstore}>
        // </Provider> */
        <BrowserRouter>
            <PageManager />
        </BrowserRouter>
    )
}