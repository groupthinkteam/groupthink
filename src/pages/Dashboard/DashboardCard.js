import React, { useState } from "react"
import Button from "../../components/Button/Button"
import TimeAgo from "react-timeago"

import { useStore } from "../../store/hook"
import { observer } from "mobx-react-lite"

import "../../styles/DashboardCard.scss"
import "../../styles/custom.scss"

const DashboardCard = props => {
    const store = useStore();
    let [isHover, setHover] = useState(false);
    const me = store.projects[props.id]

    if (!me.metadata || !me.users) return null;


    let personas = Object.entries(me.users).filter(([userID, values]) => userID !== store.userID).slice(0, 3)
    let extraUsers = Object.keys(me.users).length - (personas.length + 1)

    return (
        <div id={props.id}
            className="dashboard-card"
            onMouseEnter={() => { setHover(true) }}
            onMouseLeave={() => { setHover(false) }}
        >
            <div className="title" >
                <div className="star">
                    {
                        me.users[store.userID].isStarred ?
                            <svg onClick={() => store.unStarredThisProject(props.id)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0.48999L13.09 6.74999L20 7.75999L15 12.63L16.18 19.51L10 16.26L3.82 19.51L5 12.63L0 7.75999L6.91 6.74999L10 0.48999Z" fill="#32AAFF" />
                            </svg>
                            : null
                    }
                    {
                        isHover && !me.users[store.userID].isStarred ?
                            <svg onClick={() => store.starredThisProject(props.id)} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1.48999L14.09 7.74999L21 8.75999L16 13.63L17.18 20.51L11 17.26L4.82 20.51L6 13.63L1 8.75999L7.91 7.74999L11 1.48999Z" stroke="#DFDCDC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            : null
                    }
                </div>
                <span className="text" onClick={props.onOpen}>{me.metadata.name}</span>
            </div>
            <div className="rest">
                <Button
                    className="delete-button"
                    handleClick={() => store.deleteProject(props.id)}>
                    Delete
            </Button>
                <div className="card-description">
                    <TimeAgo date={me.users[store.userID].lastUpdatedAt} />
                </div>
                <div className="card-description">
                    <TimeAgo date={me.metadata.datecreated} />
                </div>
                <div className="shared">
                    {
                        personas.map(([_, values]) =>
                            <img className="shared-user-profile-picture" alt={values.displayName} src={values.photoURL} />
                        )
                    }
                    {
                        extraUsers > 0 ?
                            <div className="extrausers">
                                +{extraUsers}
                            </div>
                            : null
                    }
                </div>
            </div >
        </div>
    )
}

export default observer(DashboardCard)