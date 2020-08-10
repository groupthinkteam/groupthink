import React from "react"
import { Button } from "antd"
import { LogoutOutlined } from "@ant-design/icons"

import firebase from "firebase/app"

import "./MenuBar.scss"

export default function MenuBar(props) {
    console.log("menubar")
    return (
        <div className="menu-bar">
            <div className="menu-bar-panel menu-bar-panel-left">
                Welcome
            </div>
            <div className="menu-bar-panel menu-bar-panel-center">
                <div className="menu-bar-site-title">
                    groupthink
                </div>
            </div>
            <div className="menu-bar-panel menu-bar-panel-right">
                <Button onClick={props.onLogout} icon={<LogoutOutlined />}>
                    Log out
                </Button>
            </div>
        </div>
    )
}

