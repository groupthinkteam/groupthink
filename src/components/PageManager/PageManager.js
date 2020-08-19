import React from "react"
import { connect } from "react-redux"
import LoginPage from "../pages/Login/LoginPage"
import DashboardPage from "../pages/Dashboard/DashboardPage"
import "./PageManager.scss"
import Routing from "../../route";

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn
    };
}

const PageManager = (props) => {
    return (
        <div className="page">
            {props.isLoggedIn
                ? <Routing />
                : <LoginPage callback={(val) => val ? props.dispatch({ type: "LOGIN" }) : 1} />
            }
        </div>
    )
}

export default connect(mapStateToProps)(PageManager)