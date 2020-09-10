import React, { useEffect } from "react"
import { Redirect, useLocation } from "react-router-dom"
import "../../styles/Splash.scss"
import  isChild from "./SearchChild"

export default function SplashPage(props) {
    const location = useLocation()
    console.log("splashpage says: I was consulted",location)
    let page,flag=null;
    const ReturnSplash = (page) =>
    {
        return(
            props.pendingAuth ?
                <div id="splash">
                    <h1 id="splashText">Welcome to groupthink!</h1>
                    <blockquote >Unleash your ideas</blockquote>
                </div>
                : <Redirect
                    to={{
                        pathname: props.isAuth ? `${page.page}` : "/login",
                        state: { from: location }
                    }}
                />
    
        );
    }
    //---------Check for Only Project Detail---------
    if(location.state?.from != undefined)
    {
       // page = `/dashboard`
       console.log("IF")
        page = location.state.from.pathname;
        //----- ToDO :- Check isChild  ------
        
        const temp = isChild(page.split("/")[2])
        console.log(page.split("/")[2], temp)
        if(temp)
        {
            console.log("Child Is ",page.split("/")[2])
            return( <ReturnSplash page={page}/>)
        }
        else
        {
            console.log("false Child",page.split("/")[2])
            return( <ReturnSplash page="/dashboard"/>)   
        }
        
    }
    else
    { console.log("Else")
        return( <ReturnSplash page="/dashboard"/>)
    }
}