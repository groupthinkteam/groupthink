import React from 'react';
import "../../styles/ProjectCard.scss";

const DisplaySearchedCards = (props) => {
    return(
        <div id={props.id} className="project-card">
            <img
                //onClick={() => props.onOpen(props.id)}
                src={props.card.thumbnailURL}
                alt="project thumbnail" 
            />
            {props.card.name}
        </div>
    )
}
export default DisplaySearchedCards;