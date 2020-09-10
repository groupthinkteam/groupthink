import React, { useEffect } from "react"
import { Redirect, useLocation } from "react-router-dom"
import "../../styles/Splash.scss"

export default function SplashPage(props) {
    const location = useLocation()
    console.log("splashpage says: I was consulted", location)
    let page, flag = null;
    return (
        props.pendingAuth ?
            <div id="splash">
                <h1 id="splashText">Welcome to groupthink!</h1>
                <blockquote >Unleash your ideas</blockquote>
            </div>
            : <Redirect
                to={{
                    pathname: props.isAuth ? `/dashboard` : "/login",
                    state: { from: location }
                }}
            />

    );
    //---------Check for Only Project Detail---------
}
