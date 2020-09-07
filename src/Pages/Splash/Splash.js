import React, { useEffect } from "react"
import { Redirect, useLocation } from "react-router-dom"
import "../../styles/Splash.scss"
import { isChild } from "./SearchChild"

export default function SplashPage(props) {
    const location = useLocation()
    console.log("splashpage says: I was consulted",location)
    let page;
    if(location.state == undefined)
    {
        page = `/dashboard`
    }
    //---------Check for Only Project Detail---------
    else
    {
        page = location.state.from.pathname;
        isChild(page.split("/")[2],callback => {
            console.log("Callback",callback)
            if(!callback)
            page="/dashboard";
        })
    }
    
    return (
        props.pendingAuth ?
            <div id="splash">
                <h1 id="splashText">Welcome to groupthink!</h1>
                <blockquote >Unleash your ideas</blockquote>
            </div>
            : <Redirect
                to={{
                    pathname: props.isAuth ? `${page}` : "/login",
                    state: { from: location }
                }}
            />

    )
}