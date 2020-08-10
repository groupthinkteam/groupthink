import React from "react"

import MenuBar from "../../UI/MenuBar"

// import "./DashboardPage.scss"

export default function DashboardPage(props) {
    return (
        <div>
           <MenuBar onLogout={props.onLogout}/>
        </div>
    )
}