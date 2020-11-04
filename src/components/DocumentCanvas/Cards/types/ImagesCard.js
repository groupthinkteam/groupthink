import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';

import "../../../../styles/Cards/ImagesCard.scss"
import '../../../../styles/UserMenu.scss'

const ImagesCard = (props) => {
  let aspect = props.size.height / props.size.width;
  const [showPopper, setShowPopper] = useState(false);
  const buttonRef = useRef(null);
  const popperRef = useRef(null);
  const [arrowRef, setArrowRef] = useState(null);
  const { styles, attributes } = usePopper(
    buttonRef.current,
    popperRef.current,
    {
      modifiers: [
        {
          name: "arrow",
          options: {
            element: arrowRef
          }
        },
        {
          name: "offset",
          options: {
            offset: [0, 4]
          }
        },
        {
          name: "flip",
          enabled: false,
          options: {
            rootBoundary: "viewport",
            fallbackPlacements: ['right-start'],
          }
        },
      ],
      placement: "right-start"
    }
  );
  return (
    <div className="image-card" key={"imagecard".concat(props.id)} ref={buttonRef}>
      <div style={{position: "absolute", padding: '10px', right: '20px'}} onClick={() => setShowPopper(!showPopper)}>
        <div className="barmenu"></div>
        <div className="barmenu"></div>
        <div className="barmenu"></div>
      </div>
     
      <div className="image-card-image" style={{ height: props.size.height - 12 * aspect, width: props.size.width - 12 }} >

        <img
          alt={props.content.caption || "none"}
          src={props.content.url}
        // height={`${props.size.height}px`}
        // width={`${props.size.width}px`}
        />

      </div>
      {showPopper ?
        <div
          ref={popperRef}
          className="tooltips"
          style={styles.popper}
          {...attributes.popper}
        >
          <div ref={setArrowRef} style={styles.arrow} id="arrow" className="arrow" />
        
        
          <a href="#" target="blank" style={{ color: "black" }}>change image</a>
          <br />
          <a href="/dashboard" style={{ color: "black" }}>edit</a>
          
          <hr />
          <a href="#" target="blank" style={{ color: "red" }}>delete</a>
          <hr />


        </div>
        : null}
      <div className="image-card-caption">
        <InlineTextEdit />
      </div>
    </div>
  )
}

export default React.memo(ImagesCard);
