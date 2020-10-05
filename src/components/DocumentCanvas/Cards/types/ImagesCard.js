import React from 'react';
/**
 * This Card Upload Image file & Shows the Image in Galllery
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const ImagesCard = (props) =>{
  return (
    <div>
        
        { 
          props.content.text === undefined ?
          Object.entries(props.content).map((fileKey,val)=>{
            return(
              <div key={fileKey[0]}>
                File Name : {fileKey[0].split(">")[0]}
                <img src={`${fileKey[1]?.url}`} />
              </div>
            )
          })
          : null
        }
    </div>
  )
}
export default React.memo(ImagesCard);
