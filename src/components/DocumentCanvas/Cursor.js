import React, { useEffect } from "react";
import gsap from "gsap"



export default function Cursor(props) {
    let animation = gsap.to("#".concat(props.id), { x: props.x, y: props.y, duration: 0.8 });
    animation.play();

    return (
        <div id={props.id} style={{
            position: "absolute",
            width: 40,
            height: 40,
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "space-between",
        }}>
            <img alt="cursor" src={require("./jk.svg")} width="25px" height="25px" style={{ userSelect: "none" }} />
            <div style={{ backgroundColor: "darkgreen", color: "white", height: 10, fontSize: 8 }}>
                {props.name}
            </div>
        </div>
    )





}
