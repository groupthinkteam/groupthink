import React, { useEffect } from "react";
import gsap from "gsap"
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";

const MENUBAR_HEIGHT = 0;

const Cursor = observer((props) => {
    let store = useStore()

    useEffect(() => {
        gsap.to("#cursor".concat(props.id), {
            left: store.cursors[props.id].x,
            top: store.cursors[props.id].y - MENUBAR_HEIGHT,
            duration: 0.2
        }).play();
    }, [store.cursors, props.id])

    let name = store.users[props.id].name

    return (
        <div id={"cursor".concat(props.id)} style={{
            position: "absolute",
            height: 45,
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            overflow: "visible",
            zIndex: 9999999999,
        }}>
            <img alt="cursor"
                src={require("../../assets/cursor.svg")}
                style={{ userSelect: "none", maxWidth: "25px", maxHeight: "25px" }} />
            <div style={{
                marginLeft: 10, paddingLeft: 5, paddingRight: 5, paddingBottom: 2, paddingTop: 2,
                backgroundColor: "darkorange", color: "white", fontSize: 13, fontFamily: "sans-serif"
            }}>
                {name}
            </div>
        </div>
    )
})

export default Cursor;