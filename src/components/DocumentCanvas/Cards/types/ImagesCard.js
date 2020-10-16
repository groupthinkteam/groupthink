import React, {  useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
/**
 * This Card Upload Image file & Shows the Image in Galllery
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const ImagesCard = (props) =>{
  //Show Modal State
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const changeSize = (height,width) =>{
    props.typeAPI.resize(props.id,{width:width, height:height})
  }
  return (
    <>
        
        { 
          props.content.text === undefined ?
          Object.entries(props.content).map((fileKey,val)=>{
            
            return(
              <div key={fileKey[0]}>
                File Name : {fileKey[0].split(">")[0]}
                <img src={`${fileKey[1]?.url}`} onClick={handleShow} 
                  height={`${Math.floor(fileKey[1].height/3)}px`}
                  width={`${Math.floor(fileKey[1].width/4)}px`}
                  onLoad={e=>changeSize(Math.floor(fileKey[1].height/3),Math.floor(fileKey[1].width/4))}
                />
                {
                  show && (
                    <Lightbox
                      mainSrc={`${fileKey[1]?.url}`}
                      onCloseRequest={handleClose}
                    />
                  )
                }
              </div>
            )
          })
          : null
        }
    </>
  )
}
export default React.memo(ImagesCard);
