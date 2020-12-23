import React, { useEffect, useRef, useState } from "react"
import Button from "../../components/Button/Button"
import TimeAgo from "react-timeago"
import { useStore } from "../../store/hook"
import { observer } from "mobx-react-lite"
import "../../styles/Cards/GenericCard.scss";
import "../../styles/DashboardCard.scss"
import "../../styles/custom.scss"
import MenuCard from "../../components/DocumentCanvas/Cards/types/MenuCard"

const DashboardCard = props => {
    const store = useStore();
    let [isHover, setHover] = useState(false);
    const me = store.projects[props.id]
    const [showPopper, setShowPopper] = useState(false);
    const dashKebabRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dashKebabRef.current && !dashKebabRef.current.contains(event.target)) {
                setShowPopper(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dashKebabRef]);

    if (!me.metadata || !me.users) return null;

    const personas = Object.entries(me.users).filter(([userID, _]) => userID !== store.userID).slice(0, 3)
    const extraUsers = Object.keys(me.users).length - (personas.length + 1)

    return (
        <div id={props.id}
            className="dashboard-card"
            onMouseEnter={() => { setHover(true) }}
            onMouseLeave={() => { setHover(false); setShowPopper(false) }}
        >
            <div className="title" >
                <div className="controls">
                    {me.users[store.userID].permission === "admin" && isHover ?
                        <div ref={dashKebabRef}>
                            <div className="kebab">
                                <Button
                                    handleClick={() => {
                                        setShowPopper(!showPopper);
                                    }}
                                >
                                    <img alt='Menu' width="5px" src={require('../../assets/kebab.svg')} />
                                </Button>
                            </div>
                            {showPopper ?
                                <MenuCard
                                    buttonref={dashKebabRef.current}
                                    position="right-start"
                                    offset={[0, 4]}
                                    tooltipclass="tooltips"
                                    arrowclass="arrow"
                                    showpopper={true}
                                    zIndex={1}
                                >
                                    <Button className="delete-button"
                                        handleClick={() => store.deleteProject(props.id)}>
                                        Delete
                                    </Button>
                                </MenuCard>
                                : null
                            }
                        </div>
                        : <div className="kebab" />
                    }
                    {
                        me.users[store.userID].isStarred ?
                            <svg onClick={() => store.unStarredThisProject(props.id)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 0.48999L13.09 6.74999L20 7.75999L15 12.63L16.18 19.51L10 16.26L3.82 19.51L5 12.63L0 7.75999L6.91 6.74999L10 0.48999Z" fill="#32AAFF" />
                            </svg>
                            : null
                    }
                    {
                        isHover && !me.users[store.userID].isStarred ?
                            <svg onClick={() => store.starredThisProject(props.id)} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11 1.48999L14.09 7.74999L21 8.75999L16 13.63L17.18 20.51L11 17.26L4.82 20.51L6 13.63L1 8.75999L7.91 7.74999L11 1.48999Z" stroke="#DFDCDC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            : null
                    }
                </div>
                <span className="text" onClick={props.onOpen}>{me.metadata.name}</span>
                {
                    isHover && me.users[store.userID].permission === "admin" ?
                        <div></div>
                        : null
                }
            </div>
            <div className="rest">
                <div className="date">
                    {me.users[store.userID].lastUpdatedAt ?
                        <TimeAgo date={me.users[store.userID].lastUpdatedAt} />
                        : "never"}
                </div>
                <div className="date">
                    <TimeAgo date={me.metadata.datecreated} />
                </div>
                <div className="shared">
                    {
                        personas.map(([_, values]) =>
                            <img key={values.uid} className="shared-user-profile-picture" alt={values.displayName} src={values.photoURL} />
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