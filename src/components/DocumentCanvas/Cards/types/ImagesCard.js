import React from 'react';
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';

import "../../../../styles/Cards/ImagesCard.scss"

const ImagesCard = (props) => {
  let aspect = props.size.height / props.size.width;
  return (
    <div className="image-card" key={"imagecard".concat(props.id)}>
      <div className="image-card-image" style={{ height: props.size.height - 12 * aspect, width: props.size.width - 12 }}>
        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
        // height={`${props.size.height}px`}
        // width={`${props.size.width}px`}
        />
      </div>
      <div className="image-card-caption">
        <InlineTextEdit />
      </div>
    </div>
  )
}

export default React.memo(ImagesCard);
