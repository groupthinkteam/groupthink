import React from 'react';

/**
 * This File Input's the Files(e.g. `.odt,.doc,.docx`) And Features to download the file .
 * @param {*} props 
 */
const FilesCard = (props) => {
  return (
    <div>
        
        { 
            props.content.text === undefined ?
            Object.entries(props.content).map((fileKey,val)=>{
                return(
                    <div key={fileKey[0]}>
                        File Name : 
                        <a href={`${fileKey[1]?.url}`} target="_blank" rel="noopener noreferrer">{fileKey[0].split(">")[0]}</a>       
                    </div>
                )
            })
            : null
        }
    </div>
  )
}
export default React.memo(FilesCard);