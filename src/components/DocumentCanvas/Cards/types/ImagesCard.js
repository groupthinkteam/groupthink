import React, { useRef,  useEffect } from "react";
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
import "../../../../styles/Cards/ImagesCard.scss";
import { useStore } from '../../../../store/hook';
import { observer } from "mobx-react-lite";

const ImagesCard = (props) => {
  //let aspect = props.size.height / props.size.width;
  const textEditRef = useRef(null);
  const store = useStore();
  useEffect(() => {
    if (store.currentActive === props.id && textEditRef.current) {
      textEditRef.current.focus();
    }
  });

  return (
    <div className="image-card" key={"imagecard".concat(props.id)}>
      <div className="image-card-image" style={{ height: props.content.displayHeight, width: props.content.displayWidth }}>
        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
        />
      </div>
      <div className="image-card-caption">
        <InlineTextEdit
          style={{ "fontStyle": "italic" }}
          placeholder={"Add a caption. " + (props.content.label ? "e.g. " + props.content.label.description : "")}
          text={props.content.caption}
          ref={textEditRef}
          onChange={(e) => { props.typeAPI.changeContent(props.id, { ...props.content, caption: e.target.value }) }} />
      </div>

    </div>
  )
}

export default observer(ImagesCard);