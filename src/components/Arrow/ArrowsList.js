import { observer } from "mobx-react-lite";
import React from "react"
import { useStore } from "../../store/hook"
import Arrow from "./Arrow"

function ArrowList(props) {
    let store = useStore();
    return (
        <div className="arrows">
            {
                Object.entries(store.cards)
                    .filter(([id, value]) => id && id !== "root" && !value?.isCollapse)
                    .map(([id, _]) => <Arrow key={"arrow".concat(id)} id={"".concat(id)} />)
            }
        </div>
    )
}

export default observer(ArrowList);