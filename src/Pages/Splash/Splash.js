import React from "react"
import { Redirect, useLocation } from "react-router-dom"

import "../../styles/Splash.scss"

export default function SplashPage(props) {
    const location = useLocation()
    console.log("splashpage says: I was consulted")
    return (
        props.pendingAuth ?
            <div id="splash">
                <h1>Welcome to groupthink!</h1>
            </div>
            : <Redirect
                to={{
                    pathname: props.isAuth ? "/dashboard" : "/login",
                    state: { from: location }
                }}
            />

    )
}