import React, { useRef } from "react";
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';

import "../../../../styles/Cards/ImagesCard.scss";
import MenuCard from "./MenuCard";

const ImagesCard = (props) => {
  //let aspect = props.size.height / props.size.width;
  const buttonRef = useRef(null);
  return (
    <div className="image-card" key={"imagecard".concat(props.id)} ref={buttonRef}>

      <MenuCard reference={buttonRef}>
        <a href target="blank" style={{ color: "black" }}>change image</a>
        <br />
        <a href="/dashboard" style={{ color: "black" }}>edit</a>

        <hr />
        <a href target="blank" style={{ color: "red" }}>delete</a>
        <hr />

      </MenuCard>
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
