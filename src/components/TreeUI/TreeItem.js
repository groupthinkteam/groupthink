import React from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import { gsap, ScrollToPlugin } from "gsap/all"
import "../../styles/TreeUI/TreeUI.scss";

gsap.registerPlugin(ScrollToPlugin);

function TreeItem(props) {
    const store = useStore();
    var nodesInfo=null;
    var nodeFocus = {
        outlineStyle: 'none',
        border: '1px solid #32AAFF'
    };
    const id = props.cardID;
    const me = store.cards[id];
    const scrollToID = () => {
        let height = document.getElementById("card-container").style.height;
        let width = parseInt(document.getElementById("card-container").style.width);
        let x = store.cards[id].position.x - window.innerWidth - 100;
        let y = store.cards[id].position.y - height - 100;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        let tl = gsap.timeline();
        tl.to("#card-container", { duration: 0.3, scrollTo: { x: x, y: y } });
        tl.to("#".concat(id), { scale: 1.3, duration: 0.3 });
        tl.to("#".concat(id), { scale: 1.0, duration: 0.1 })
        tl.play()

    }
    function typeToImage(type) {
        function sanitizeType() {
            switch (type) {
                case "blank":
                    return "text"
                case "text":
                    return "text"
                case "VideoLink":
                    return "video"
                case "video":
                    return "video"
                case "VideoFile":
                    return "video"
                case "image":
                    return "image"
                case "audio":
                    return "audio"
                case "link":
                    return "link"
                case "file":
                    return "file"
                default:
                    return "text"
            }
        }
        return (
            <img className="type-icon" src={require("../../assets/card-icons/" + sanitizeType() + ".svg")} alt={me.type} />
        )
    }
    if (id !== 'dummy') {
        const me = store.cards[id];
        // console.log("ME ", id, me)
        switch (me?.type) {
            case 'root': nodesInfo = store.projectName; break;
            case 'text':
                nodesInfo = me.content?.title || me.content.text;
                break;
            case "todo": break;
            case "link": nodesInfo = me.content.title; break;
            case "audio": nodesInfo = me.content.metadata?.name; break;
            case "image":
                if (me.content.caption || me.content.label?.description)
                    nodesInfo = me.content.label?.description || me.content.caption;
                else
                    nodesInfo = me.content.metadata?.name;
                break;
            case "VideoFile": nodesInfo = me.content.metadata?.name; break;
            case 'file': nodesInfo = me.content.metadata?.name; break;
            case 'VideoLink': nodesInfo = me.content.metadata.title; break;
            case "blank": nodesInfo = 'New/Blank Node'; break;
            default:  break;
        }
    }
    if (props.cardID === "dummy") return null;
    // console.log(nodesInfo,"INFO")
    return (
        <div className="treeitem"
            onClick={() => id === 'root' ? null : scrollToID()}
            style={store.currentActive === id ? nodeFocus : {}}>
            <div className="content">
                
                {
                    id !== 'root' && me?
                    typeToImage(me.type):null
                }
                {
                    props.cardID === "root" ?
                        store.projectName
                        : nodesInfo?.length
                            ?
                            nodesInfo.length > 21 ? nodesInfo.substring(0, 15).concat('...') : nodesInfo
                            : nodesInfo
                }
                
            </div>
        </div>
    )
}

export default observer(TreeItem) 