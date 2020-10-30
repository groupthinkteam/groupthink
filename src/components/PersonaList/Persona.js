import React from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";

import "./Persona.scss"

function Persona(props) {
    let store = useStore()
    let user = store.users[props.userID]
    return (
        <div className="persona-item">
            <img alt={user.displayName} src={user.photoURL}/>
            {user.displayName}
        </div>
    )
}

export default observer(Persona)