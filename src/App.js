import React from "react"
import PageManager from "./components/PageManager"
import { HashRouter } from "react-router-dom"

import "./styles.scss"

export default function App() {

    // entry point to the app
    return (
        <HashRouter>
            <PageManager />
        </HashRouter>
    )
}