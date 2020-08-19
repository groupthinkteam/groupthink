import React,{Component } from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import DashboardPage from "./components/pages/Dashboard/DashboardPage";
import MenuBar from "./components/UI/MenuBar/MenuBar";
import MainPage from "./components/pages/MainPage/MainPage";
export default class Routing extends Component {
    render(){
        return(
            <>
                <MenuBar onLogout={this.props.onLogout} />
                <Switch>
                    <Route path='/dashboard' component={()=><DashboardPage/>} />
                    <Route path='/main' component={()=><MainPage />} />
                    <Redirect to="/dashboard" />
                </Switch>
            </>
        )}
}