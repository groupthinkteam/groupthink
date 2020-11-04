import React, { useRef, useState } from "react";
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';

import "../../../../styles/Cards/ImagesCard.scss";
import CardMenu from "../../../PopperMenu/PopperMenu";

const ImagesCard = (props) => {
  //let aspect = props.size.height / props.size.width;
  const [showPopper, setShowPopper] = useState(false);
  const buttonRef = useRef(null);

  return (
    <div className="image-card" key={"imagecard".concat(props.id)} ref={buttonRef}>
      <div style={{ position: "absolute", padding: '10px', right: '20px' }} onClick={() => setShowPopper(!showPopper)}>
        <div className="barmenu"></div>
        <div className="barmenu"></div>
        <div className="barmenu"></div>
      </div>
      <CardMenu buttonref={buttonRef}
        position="right-start"
        offset={[0, 4]}
        tooltipclass="tooltips"
        arrowclass="arrow"
        showpopper={showPopper}
      >
        <a href target="blank" style={{ color: "black" }}>change image</a>
        <br />
        <a href="/dashboard" style={{ color: "black" }}>edit</a>

        <hr />
        <a href target="blank" style={{ color: "red" }}>delete</a>
        <hr />

      </CardMenu>
      <div className="image-card-image" style={{ height: props.content.displayHeight, width: props.content.displayWidth }}>

        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
        />

      </div>
      <div className="image-card-caption">
        <InlineTextEdit
          style={{ "font-style": "italic" }}
          placeholder={"Add a caption. " + (props.content.label ? "e.g. " + props.content.label.description : "")}
          text={props.content.caption}
          onChange={(e) => { props.typeAPI.changeContent(props.id, { ...props.content, caption: e.target.value }) }} />
      </div>

    </div>
  )
}

export default React.memo(ImagesCard);
