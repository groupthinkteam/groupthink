import React from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../../store/hook"

import Persona from "./Persona"
import "./PersonaList.scss"

function PersonaList(props) {
    let store = useStore()

    if (!store.users) return null;
    return (
        <div className="persona-list">
            {Object.keys(store.users)
                .filter(
                    (userID) => userID !== store.currentUser.uid && Date.now() - store.users[userID].lastUpdatedAt < 60000
                ).map(
                    (userID) => <Persona key={"persona".concat(userID)} userID={userID} />
                )}
        </div>
    )
}

export default observer(PersonaList)