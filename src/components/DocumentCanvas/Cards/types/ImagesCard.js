import React from 'react';
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
/**
 * This Card Upload Image file & Shows the Image in Galllery
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const ImagesCard = (props) => {
  return (
    <div className="image-card" key={"imagecard".concat(props.id)}>
      <div className="image-card-image">
        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
          height={`${props.size.height}px`}
          width={`${props.size.width}px`}
        />
      </div>
      <div className="image-card-caption">
        <InlineTextEdit />
      </div>
    </div>
  )
}

export default React.memo(ImagesCard);
