import React, { useState } from "react"
import { Switch, Route } from "react-router"
import { useHistory } from "react-router-dom"

import LoginPage from "../pages/Login/LoginPage"
import DashboardPage from "../pages/Dashboard/DashboardPage"

import "./PageManager.scss"

export default function PageManager() {
    // state is used to determine which page to display
    const [isLoggedIn, setLoginState] = useState(false);
    const history = useHistory()

    return (
        <div className="page">
            <Switch>
                {isLoggedIn
                    ? history.push("/dashboard")
                    : <LoginPage callback={setLoginState} />
                }
                <Route exact to="/dashboard" component={DashboardPage} />
                {
                    // add another route for document page here
                }
            </Switch>
        </div>

    )


}