import React from 'react';
import * as pretty from 'prettysize';
/**
 * This File Input's the Files(e.g. `.odt,.doc,.docx`) And Features to download the file .
 * @param {*} props 
 */
const FilesCard = ({content}) => {

    return (
        <div>
            File Name :
            <a href={`${content.url}`} target="_blank" rel="noopener noreferrer">
                {content.metadata.name}
            </a>
            Last Modified : {new Date(content.metadata.updated).toDateString()}
            Size : {pretty(content.metadata.size)}
        </div>
    )
}
export default React.memo(FilesCard);