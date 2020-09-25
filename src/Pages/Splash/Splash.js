import React, { useEffect } from "react"
import { Redirect, useLocation } from "react-router-dom"
import "../../styles/Splash.scss"

/**
 * This File Redirects the page to `Dashboard` If Signed In 
 * And If Not Signed In then Redirects to `Login Page`
 * @param {*} props The Following are the Props:
 * @param {Boolean} props.isAuth Contains if user is authenticated or not
 * @param {Boolean} props.pendingAuth Contains Authentication State 
 */
export default function SplashPage(props) {
    const location = useLocation()
    console.log("splashpage says: I was consulted", location)
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
}
