import React from 'react';
import * as pretty from 'prettysize';

import "../../../../styles/Cards/FileCard.scss"

/**
 * This File Input's the Files(e.g. `.odt,.doc,.docx`) And Features to download the file .
 * @param {*} props 
 */
const FilesCard = ({ content }) => {
    return (
        <div className="file-card">
            <a href={`${content.url}`} target="_blank" rel="noopener noreferrer">
                <span className="file-card-header">
                    <img src={require("../../../../assets/card-icons/file.svg")} alt="file" />
                    <span className="name">{content.metadata.name}</span>
                </span>
            </a>
            <div className="file-card-info">
                <div>
                    {(new Date(content.metadata.updated).toDateString())}
                </div>
                <div>
                    {pretty(content.metadata.size)}
                </div>
            </div>
        </div >
    )
}
export default React.memo(FilesCard);