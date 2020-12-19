import React from "react"
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/hook";
import { gsap, ScrollToPlugin } from "gsap/all"
import "../../styles/TreeUI/TreeUI.scss";

gsap.registerPlugin(ScrollToPlugin);

function TreeItem(props) {
    const store = useStore();
    var nodesInfo;
    var nodeFocus = {
        outlineStyle: 'none',
        border: '1px solid #32AAFF'
    };
    const id = props.cardID;
    const scrollToID = () => {
        let height = document.getElementById("card-container").style.height;
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
    if (id !== 'dummy') {
        const me = store.cards[id];
        switch (me.type) {
            case 'root': nodesInfo = store.projectName; break;
            case 'text':
                if (me.content.title)
                    nodesInfo = me.content.title;
                else
                    nodesInfo = me.content.text.replace(/<[^>]+>/g, ' ').replace(/^\s+|\s+$/g, '').split(/\s+/).join('');
                break;
            case "todo": break;
            case "link": nodesInfo = me.content.url; break;
            case "audio": nodesInfo = me.content.metadata?.name; break;
            case "image":
                if (me.content.captions)
                    nodesInfo = me.content.captions;
                else
                    nodesInfo = me.content.metadata?.name;
                break;
            case "VideoFile": nodesInfo = me.content.metadata?.name; break;
            case 'file': nodesInfo = me.content.metadata?.name; break;
            case 'VideoLink': nodesInfo = me.content.metadata.title; break;
            case "blank": nodesInfo = 'New/Blank Node'; break;
            default: break;
        }
    }
    if (props.cardID === "dummy") return null;
    return (
        <div className="treeitem"
            onClick={() => id === 'root' ? null : scrollToID()}
            style={store.currentActive === id ? nodeFocus : {}}>
            <div className="content">
                {
                    props.cardID === "root" ? 
                        store.projectName 
                        : nodesInfo.length > 21 ?nodesInfo.substring(0,21).concat('...') : nodesInfo
                }
            </div>
        </div>
    )
}

export default observer(TreeItem) 