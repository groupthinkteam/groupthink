import React from 'react';
import "../../../../styles/Cards/ShrinkedCard.scss"
const ShrinkedCard = ({ url, title, name }) => {
    return (
        <div className="shrinked-card">
            <a href={`${url}`} target="_blank" rel="noopener noreferrer">
                <span className="shrinked-card-header">
                    <span className="name">{title || name}</span>
                </span>
            </a>
            <div className="shrinked-card-info">
                <img src={require("../../../../assets/Collapsed/show-link.svg")} alt="Link-Icon"/>
                {url}
            </div>
        </div>
    )
}
export default ShrinkedCard