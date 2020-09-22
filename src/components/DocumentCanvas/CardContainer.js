import React from "react";
import GenericCard from "./Cards/GenericCard"
import Button from "../Button/Button"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// props:
// 1. cards: an object containing cardID: card_info entries
// 2. cardAPI: methods that set card params/other card stuff
// 3. projectID: firebase id of the current project
// 3. //TODO: container resizing
export default function CardContainer(props) {
    const cardAPI = props.cardAPI; // for brevity
    //console.log("Card API \n ",url);
    return (
        <div className="card-container w-100 main_card pt-3 pb-3" style={{ border: "2px solid black", overflow: "scroll", position: "absolute" }}>
            <div className="container-filler" style={{ ...props.container, position: "absolute", backgroundColor: "grey" }} />
            <div className="button_link">
                <Button handleClick={cardAPI.add('PDF')}>Add PDF</Button>
                <Button handleClick={cardAPI.add('youtube')}>Add Youtube</Button>
                <Button handleClick={cardAPI.add()}>Add new node</Button>
                <Button handleClick={cardAPI.add('image')}>Add Images</Button>
                <Button handleClick={cardAPI.add('files')}>Add files</Button>
                <Button handleClick={cardAPI.add('videos')}>Add Videos</Button>
                <Button handleClick={cardAPI.add('audios')}>Add Audio</Button>
                <Button handleClick={cardAPI.add('link')}>Add Link</Button>
            </div>
            {
                props.cards ? Object.entries(props.cards).filter(([id, card]) => id != null).map(
                    ([id, card]) => {
                        return (
                            <DndProvider backend={HTML5Backend}>
                                <GenericCard
                                    id={id}
                                    cardDetail={card}
                                    cardAPI={cardAPI}
                                    projectID={props.projectID}
                                />
                            </DndProvider>
                        )
                    }
                ) : <p>Container is Empty!!</p>
            }
        </div >
    )
}