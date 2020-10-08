import React, { useEffect } from "react";
import gsap from "gsap"

const MENUBAR_HEIGHT = 60;

export default function Cursor(props) {
    useEffect(() => {
        gsap.to("#cursor".concat(props.id), { left: props.x, top: props.y - MENUBAR_HEIGHT, duration: 0.2 }).play();
    }, [props.x, props.y, props.id])

    return (
        <div id={"cursor".concat(props.id)} style={{
            position: "absolute",
            height: 45,
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            overflow: "visible",
        }}>
            <img alt="cursor"
                src={require("../../assets/cursor.svg")}
                style={{ userSelect: "none", maxWidth: "25px", maxHeight: "25px" }} />
            <div style={{
                marginLeft: 10, paddingLeft: 5, paddingRight: 5, paddingBottom: 2, paddingTop: 2,
                backgroundColor: "darkorange", color: "white", fontSize: 13, fontFamily: "sans-serif"
            }}>
                {props.name}
            </div>
        </div>
    )





}
