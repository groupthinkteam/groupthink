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
            ([userID, _]) => {
                if (userID !== store.currentUser.uid) {
                    if (Date.now() - store.users[userID].lastUpdatedAt < 60000) {
                        return true;
                    }
                    else if (store.users[userID]?.following) {
                        store.followAUser = !store.followAUser;
                        store.removeUserFollow(userID);
                        return false;
                    }
                }
                return false
            }
        )

    if (users.length > 0) {
        return (
            <>
                <div className="menu-bar-separator" />
                <div className="persona-list">
                    {users.map(
                        ([userID, values]) => {
                            return (
                                <div data-delay-show='750' data-effect="solid" data-tip={`${values.name}`}
                                    key={"persona".concat(userID)}
                                    className="persona-item"
                                    style={{ backgroundColor: store.followAUser ? 'yellow' : '' }}
                                >
                                    <img //onClick={() => { toggleFollowAUser(userID) }} 
                                        alt={values.displayName} src={values.photoURL} 
                                    />
                                    {/* {values.name} */}
                                </div>
                            )
                        }
                    )}
                </div>
            </>
        )
    }
    else
        return null;
}

export default observer(PersonaList)