import React from "react";
import { Rnd } from "react-rnd";
import GenericCard from "./Cards/GenericCard"
import Button from "../Button/Button"

// props:
// 1. cards: an object containing cardID: card_info entries
// 2. cardAPI: methods that set card params/other card stuff
// 3. projectID: firebase id of the current project
// 3. //TODO: container resizing
export default function CardContainer(props) {
    const cardAPI = props.cardAPI; // for brevity
    //console.log("Card API \n ",url);
    return (
        <>
            <div className="card-container" style={{...props.container?.size,
                border: "2px solid black" ,
                }}>
                <Button handleClick={cardAPI.add('PDF')}>Add PDF</Button>
                <Button handleClick={cardAPI.add('youtube')}>Add Youtube</Button>
                <Button handleClick={cardAPI.add()}>Add new node</Button>
                <Button handleClick={cardAPI.add('image')}>Add Images</Button>
                <Button handleClick={cardAPI.add('files')}>Add files</Button>
                <Button handleClick={cardAPI.add('videos')}>Add Videos</Button>
                <Button handleClick={cardAPI.add('audios')}>Add Audio</Button> 
                <Button handleClick={cardAPI.add('link')}>Add Link</Button> 
                {props.cards ? Object.entries(props.cards).filter(([id, card]) => id != null).map(
                    ([id, card]) => {
                        return (
                            <Rnd
                                key={id}
                                style={{ backgroundColor: "green" }}
                                dragHandleClassName="card-handle"
                                size={card.size}
                                minHeight={375}
                                minWidth={275}
                                position={card.position}
                                //bounds="card-container"
                                onResizeStop = {(e,dir,ref,delta)=>{
                                    cardAPI.resize(id,{width:ref.style.width , height:ref.style.height})
                                }}
                                onDrag={(e, data) => {
                                    cardAPI.localMove(id, { x: data.x, y: data.y }, card.size);
                                }}
                                onDragStop={(e, data) => {
                                    cardAPI.saveMove(id, { x: data.x, y: data.y });
                                }}
                                id={`${id}`}
                            >
                              
                                <GenericCard
                                    id={id}
                                    cardDetail={card}
                                    cardAPI={cardAPI}
                                    projectID={props.projectID}
                                />
                            </Rnd>
                        )
                    }
                ) : <p>Container is Empty!!</p>}
            </div>
            
        </>
    )
}