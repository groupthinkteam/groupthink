import React, { useEffect } from "react";
import gsap from "gsap"


export default function Cursor(props) {
    useEffect(() => {
        gsap.to("#cursor".concat(props.id), { x: props.x, y: props.y, duration: 0.8 }).play();
    }, [props.x, props.y, props.id])

    return (
        <div id={"cursor".concat(props.id)} style={{
            position: "absolute",
            width: 40,
            height: 40,
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "space-between",
            overflow: "visible",
        }}>
            <img alt="cursor" src={require("../../assets/cursor.svg")} style={{ userSelect: "none", maxWidth: "25px", maxHeight: "25px" }} />
            <div style={{ backgroundColor: "darkgreen", color: "white", height: 16, fontSize: 13, fontFamily: "sans-serif" }}>
                {props.name}
            </div>
        </div>
    )





}
