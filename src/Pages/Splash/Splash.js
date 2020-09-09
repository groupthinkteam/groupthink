import React, { useEffect } from "react"
import { Redirect, useLocation } from "react-router-dom"
import "../../styles/Splash.scss"
import { isChild } from "./SearchChild"

export default function SplashPage(props) {
    const location = useLocation()
    console.log("splashpage says: I was consulted",location)
    let page,flag=null;
    //---------Check for Only Project Detail---------
    if(location.state != undefined)
    {
       // page = `/dashboard`
        page = location.state.from.pathname;
        //----- ToDO :- Check isChild  ------
        isChild(page.split("/")[2],(data) => {
            flag=data;
        })
    }
    if(!flag && flag != null)
    {
        page="/dashboard";
        
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