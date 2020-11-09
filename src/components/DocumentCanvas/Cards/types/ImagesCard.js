import React, { useRef, useState, useEffect } from "react";
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
import "../../../../styles/Cards/ImagesCard.scss";
import CardMenu from "../../../PopperMenu/PopperMenu";
import { useStore } from '../../../../store/hook';
import { observer } from "mobx-react-lite";
import { functions } from "../../../../services/firebase";
const ImagesCard = (props) => {
  //let aspect = props.size.height / props.size.width;
  const [showPopper, setShowPopper] = useState(false);
  const buttonRef = useRef(null);
  const textEditRef = useRef(null);
  const store = useStore();
  useEffect(() => {
    if (store.currentActive === props.id && textEditRef.current) {
      textEditRef.current.focus();
    }
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowPopper(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonRef]);

  // if (props.rightClick.isClicked && showPopper) {
  //   setShowPopper(false);
  // }

  const convImage = () => {
    const imageData = {
      fpath: props.content.metadata.fullPath,
      contentType: props.content.metadata.contentType,
      customMetadata: props.content.metadata.customMetadata
    }
    var convToBw = functions.httpsCallable('imageToBw')
    convToBw(imageData).then(() => { console.log("Converted successfully") }).catch(() => { console.log("fail") })
  }
  const menuList = (
    <div>
      <a href="true" target="blank" style={{ color: "black" }}>change image</a>
      <br />
      <a href="/dashboard" style={{ color: "black" }}>edit</a>
      <hr />
      <p style={{ color: 'green', cursor: 'pointer' }} onClick={() => {
        store.addCard({ x: props.position.x + 220, y: props.position.y + 220 }, { width: 310, height: 200 }, props.id, 'blank')
      }}
      >
        Add Child
      </p>
      <hr />
      <p style={{ cursor: 'pointer', color: "red" }} onClick={() => {
        store.removeCard(props.id, "recursive");
      }}>
        Delete
      </p>
      <hr />
      <button onClick={(e) => convImage()}>Convert to B/W</button>
    </div>
  )

  return (
    <div className="image-card" key={"imagecard".concat(props.id)} ref={buttonRef}>
      <div style={{ position: "absolute", padding: '10px', right: '33px', width: '35px' }} onClick={() => { props.defaultClick(); setShowPopper(!showPopper); }}>
        <img alt='Menu' width="35px" src={require('../../../../assets/kebabMenu.png')} />
      </div>

      <CardMenu buttonref={buttonRef}
        position="right-start"
        offset={[0, 4]}
        tooltipclass="tooltips"
        arrowclass="arrow"
        showpopper={showPopper}
      >
        {menuList}
      </CardMenu>
      {
        props.rightClick.isClicked && (
          <div className="tooltips" style={{ position: "absolute", left: props.rightClick.x + "px", top: props.rightClick.y + "px" }}>
            {menuList}
          </div>
        )
      }
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

export default React.memo(observer(ImagesCard));