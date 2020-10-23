import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Card from "./Card";
import { useStore } from "../../store/hook";
import "../../styles/Projects.scss";
/**
 * @component
 * This Component Deals with All Database & Storage Operation Required In DashBoard Page
 * @contains
 * @function `onAddNew()` Adds New Project To Database.
 * @function `onDelete(id)` Deletes the Corresponding ID from DB & Storage(if Exists) 
 * @function `onRename(id)` Rename The Projects of Given ID on Database .
 * @function `onOpen(id)` Redirects The Page to 'projects/`${id}`'
 * @function `onChange(id,text)` Store the text in Current Card State. 
 * @param {*} props The Props Passed is 'currentUser'
 */
export default function Projects(props) {
    const history = useHistory();
    let store = useStore();
    useEffect(() => {
        store.addDashboardListeners()
        return () => store.removeDashboardListeners()
    }, [])

    const onOpen = (id) => {
        console.log("attempting to open project", id);
        store.
        history.push("/project/" + id)
    }
    /**
     * Store the text in Current Card State.
     * @param {String} id 
     * @param {String} text 
     */
    var onChange = (id, text) => {
        console.log("un-finalized text change in", id, ". new text:", text);
        console.log({ ...cards, [id]: { ...cards[id], name: text } })
        setCards({ ...cards, [id]: { ...cards[id], name: text } });
    }

    const sharedCardsToRender = cards ?
        Object.entries(reverseObject(cards)).filter(([id, card]) => card.shared).map(
            ([id, card]) => {
                return <Card
                    key={id}
                    id={id}
                    card={card}
                    onChange={onChange}
                    onSave={onRename}
                    onDelete={onDelete}
                    onOpen={onOpen}
                />
            }
        )
        : null

    const ownerCardsToRender = cards ?
        Object.entries(cards).reverse().filter(([id, card]) => !card.shared).map(
            ([id, card]) => {
                return <Card
                    key={id}
                    id={id}
                    card={card}
                    onChange={onChange}
                    onSave={onRename}
                    onDelete={onDelete}
                    onOpen={onOpen}
                />
            }
        )
        : null
    console.log("owner", ownerCardsToRender, "shared", sharedCardsToRender)
    return (
        isLoaded ?
            <div className="project-view-container">
                <div className="project-container-title" > Your Projects</div >
                <div className="project-card-container">
                    <Card addNew onAddNew={onAddNew} />
                    {ownerCardsToRender
                        // ||
                        //     <div className="project-container-nodata">
                        //         You have not created any projects yet. What are you waiting for? Click "Add a Project" to begin.
                        //     </div>
                    }
                </div>
                <div className="project-container-title">Shared With You</div>
                <div className="project-card-container">
                    {sharedCardsToRender && sharedCardsToRender.length > 0
                        ? sharedCardsToRender
                        : <div className="project-container-nodata">
                            No one has shared a project with you yet. SAD!
                        </div>
                    }
                </div>
            </div >
            : <div>
                Loading...
            </div>
    )
}