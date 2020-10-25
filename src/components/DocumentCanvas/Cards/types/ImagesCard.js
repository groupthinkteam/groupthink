import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
/**
 * This Card Upload Image file & Shows the Image in Galllery
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const ImagesCard = (props) => {
  //Show Modal State
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const changeSize = (height, width) => {
    props.typeAPI.resize(props.id, { width: width, height: height })
  }
  return (
    <>
      {
        Object.entries(props.content).map(([key, val]) => {
          if (val?.height !== undefined) {
            const maxDimension = Math.max(val.height, val.width);
            const multiplier = maxDimension > 500 ? 500 / maxDimension : 1;
            return (
              <div key={key}>
                <img
                  alt={key}
                  src={`${val?.url}`}
                  onClick={handleShow}
                  height={`${Math.floor(val.height * multiplier)}px`}
                  width={`${Math.floor(val.width * multiplier)}px`}
                  onLoad={e => changeSize(Math.floor(val.height * multiplier) + 5, Math.floor(val.width * multiplier) + 5)}
                />
                {
                  show && (
                    <Lightbox
                      mainSrc={`${val?.url}`}
                      onCloseRequest={handleClose}
                    />
                  )
                }
              </div>
            )
          }
          else
          return null;
        })
      }
    </>
  )
}
export default React.memo(ImagesCard);
