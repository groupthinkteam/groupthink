import React from "react";
import gsap from "gsap"

export default function Cursor(props) {
    let animation = gsap.to("#".concat(props.id), { x: props.x, y: props.y, duration: 0.8 });
    animation.play();
    console.log("props",props.x )
    return (
        <div id={props.id} style={{
            position: "absolute",
            width: 40,
            height: 40,
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "space-between"
        }}>
            <img alt="cursor" src={require("./jk.svg")} width="25px" height="25px" />
            <div style={{ border: "1px dashed black", height: 10, fontSize: 8 }}>
                {props.id}
            </div>
        </div>
    )
}
