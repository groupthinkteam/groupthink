import React from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../../store/hook"

import "../../styles/PersonaList.scss"

function PersonaList(props) {
    const store = useStore()
    if (!store.users) return null;
    const toggleFollowAUser = (userID) => {
        store.followAUser = !store.followAUser;
        if (store.followAUser)
            store.addUserFollow(userID);
        else
            store.removeUserFollow(userID);
    }
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
                                <div key={"persona".concat(userID)} className="persona-item" style={{backgroundColor:store.followAUser?'yellow':''}}>
                                    <img onClick={() => {toggleFollowAUser(userID)}} alt={values.displayName} src={values.photoURL} />
                                    {values.displayName}
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