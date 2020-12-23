import React, { useRef,  useEffect } from "react";
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
import "../../../../styles/Cards/ImagesCard.scss";
import { useStore } from '../../../../store/hook';
import { observer } from "mobx-react-lite";

const ImagesCard = (props) => {
  //let aspect = props.size.height / props.size.width;
  const textEditRef = useRef(null);
  const store = useStore();
  const me = store.cards[props.id]
  console.log("FROM IMAGE CARD ",me.size.height , props.changeSize)
  useEffect(() => {
    if (store.currentActive === props.id && textEditRef.current) {
      textEditRef.current.focus();
    }
  },[props.id,store.currentActive]);

  return (
    <div className="image-card" key={"imagecard".concat(props.id)}>
      <div className="image-card-image" 
      style={{ 
        height: me.size.height -60,// props.changeSize ? props.changeSize.height - me.size.height + me.content.displayHeight  :  props.content.displayHeight, 
        width: me.size.width -25//props.changeSize ? props.changeSize.width - me.size.width + me.content.displayWidth  : props.content.displayWidth 
      }}>
        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
        />
      </div>
      <div className="image-card-caption">
        <InlineTextEdit
          style={{ "fontStyle": "italic"  , padding:'3px 5px'}}
          placeholder={"Add a caption. " + (props.content.label ? "e.g. " + props.content.label.description : "")}
          text={props.content.caption}
          ref={textEditRef}
          onChange={(e) => { props.typeAPI.changeContent(props.id, { ...props.content, caption: e.target.value }) }} />
      </div>

    </div>
  )
}

export default observer(ImagesCard);