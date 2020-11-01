import React from 'react';
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
/**
 * This Card Upload Image file & Shows the Image in Galllery
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const ImagesCard = (props) => {
  const changeSize = (height, width) => {
    props.typeAPI.resize(props.id, { width: width, height: height })
  }
  const maxDimension = Math.max(props.content.height, props.content.width);
  const multiplier = maxDimension > 300 ? 300 / maxDimension : 1;
  return (
    <div className="image-card" key={"imagecard".concat(props.id)}>
      <div className="image-card-image">
        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
          height={`${Math.floor(props.content.height * multiplier)}px`}
          width={`${Math.floor(props.content.width * multiplier)}px`}
          // onLoad={e => changeSize(Math.floor(props.content.height * multiplier) + 5, Math.floor(props.content.width * multiplier) + 5)}
        />
      </div>
      <div className="image-card-caption">
        <InlineTextEdit />
      </div>
    </div>
  )
}

export default React.memo(ImagesCard);
