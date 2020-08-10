import React from "react"
import { Button } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { connect } from "react-redux"

import "./MenuBar.scss"

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn
    };
}

function MenuBar(props) {
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
                <Button onClick={() => props.dispatch({ type: "LOGOUT" })} icon={<LogoutOutlined />}>
                    Log out
                </Button>
            </div>
        </div>
    );
}

export default connect(mapStateToProps)(MenuBar);

