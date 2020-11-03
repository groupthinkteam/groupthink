import React from 'react';
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';

import "../../../../styles/Cards/ImagesCard.scss"

const ImagesCard = (props) => {
  return (
    <div className="image-card" key={"imagecard".concat(props.id)}>
      <div className="image-card-image" style={{ height: props.content.displayHeight, width: props.content.displayWidth }}>
        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
        />
      </div>
      <div className="image-card-caption">
        <InlineTextEdit placeholder="add a caption..." />
      </div>
    </div>
  )
}

export default React.memo(ImagesCard);
