import React from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../../store/hook"

import "../../styles/PersonaList.scss"

function PersonaList(props) {
    let store = useStore()
    if (!store.users) return null;

    let users =
        Object.entries(store.users).filter(
            ([userID, _]) =>
                userID !== store.currentUser.uid && Date.now() - store.users[userID].lastUpdatedAt < 60000
        )

    if (users.length > 0) {
        return (
            <>
                <div className="menu-bar-separator" />
                <div className="persona-list">
                    {users.map(
                        ([userID, values]) => {
                            return (
                                <div data-tip={`${values.name}`} key={"persona".concat(userID)} className="persona-item">
                                    <img alt={values.displayName} src={values.photoURL} />
                                    {/* {values.name} */}
                                </div>
                            )
                        }
                    )}
                </div>
            </>
        )
    }
    else return null;
}

export default observer(PersonaList)