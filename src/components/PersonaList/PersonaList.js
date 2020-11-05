import React from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../../store/hook"

import "../../styles/PersonaList.scss"

function PersonaList(props) {
    let store = useStore()
    if (!store.users) return null;
    return (
        <div className="persona-list">
            {Object.entries(store.users)
                .filter(
                    ([userID, _]) => userID !== store.currentUser.uid && Date.now() - store.users[userID].lastUpdatedAt < 60000
                ).map(
                    ([userID, values]) =>
                        <div key={"persona".concat(userID)} className="persona-item">
                            <img alt={values.displayName} src={values.photoURL} />
                            {values.displayName}
                        </div>
                )}
        </div>
    )
}

export default observer(PersonaList)