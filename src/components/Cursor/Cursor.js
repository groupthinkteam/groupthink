import React, { useEffect } from "react";
import gsap from "gsap"
import { useStore } from "../../store/hook";
import { observer } from "mobx-react-lite";

const MENUBAR_HEIGHT = 0;

const Cursor = observer((props) => {
    const store = useStore();
    const scrollToID = (id) => {
        let height = document.getElementById("card-container").style.height;
        let x = store.cursors[id].x - window.innerWidth - 100;
        let y = store.cursors[id].y - window.innerHeight/2 -height - 100 ;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        let tl = gsap.timeline();
        tl.to("#card-container", { duration: 0.3, scrollTo: { x: x, y: y } });
        tl.play()

    }
    useEffect(()=>{
        const follower = store.users[props.id].following
        console.log("users followed" ,  follower? store.users[follower].email:'not following')
        
        if(follower && store.userID === follower ){
            if(!store.followAUser){
                store.removeUserFollow(props.id);
            }
            scrollToID(props.id)
        }
    })
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
                position: "relative",
                marginLeft: 15, top: -5, paddingLeft: 5, paddingRight: 5, paddingBottom: 2, paddingTop: 4,
                backgroundColor: "#48BB35", color: "white", fontSize: 14, fontFamily: "Overpass", borderRadius: 6
            }}>
                {name}
            </div>
        </div>
    )
})

export default Cursor;