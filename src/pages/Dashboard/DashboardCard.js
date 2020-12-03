import React from "react"
import Button from "../../components/Button/Button"
import TimeAgo from "react-timeago"

import { useStore } from "../../store/hook"
import { observer } from "mobx-react-lite"

import "../../styles/DashboardCard.scss"
import "../../styles/custom.scss"


const DashboardCard = props => {
    const store = useStore();
    const me = store.projects[props.id]
    if (!me.metadata) return null;
    if (!me.users) return null
    return (
        <div id={props.id} className="dashboard-card">
            <table>
                <tbody>

                    <tr>
                        <td>

                            <div className="title" >
                                {
                                    me.isStarred ?
                                        <svg onClick={() => store.unStarredThisProject(props.id)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0.48999L13.09 6.74999L20 7.75999L15 12.63L16.18 19.51L10 16.26L3.82 19.51L5 12.63L0 7.75999L6.91 6.74999L10 0.48999Z" fill="#32AAFF" />
                                        </svg>
                                        : <svg onClick={() => store.starredThisProject(props.id)} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1.48999L14.09 7.74999L21 8.75999L16 13.63L17.18 20.51L11 17.26L4.82 20.51L6 13.63L1 8.75999L7.91 7.74999L11 1.48999Z" stroke="#DFDCDC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                }
                                <span onClick={props.onOpen}>{me.metadata.name}</span>
                            </div>
                            <Button
                                // className="custom_btn"
                                handleClick={() => store.deleteProject(props.id)}>
                                Delete
                            </Button>
                        </td>
                        <td>
                            <div className="card-description">
                                <TimeAgo date={me.users[store.userID].lastUpdatedAt} />
                            </div>
                        </td>
                        <td>
                            <div className="card-description">
                                <TimeAgo date={me.metadata.datecreated} />
                            </div>
                        </td>
                        <td>
                            {
                                Object.entries(me.users)
                                    .map(
                                        ([userID, values]) => {
                                            return <div key={"project-shared".concat(userID)}  >
                                                <img className="shared-user-profile-picture" alt={values.displayName} src={values.photoURL} />

                                            </div>
                                        }
                                    )
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default observer(DashboardCard)