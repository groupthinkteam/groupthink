import React from "react"
import { useStore } from "../../store/hook"
import Arrow from "./Arrow"

function ArrowList(props) {
    let store = useStore();
    return (
        <div className="arrows">
            {Object.entries(store.cards).map(
                ([id, card]) =>
                    card.parent && card.parent !== "root" &&
                    <Arrow key={"arrow".concat(id)} id={"".concat(id)} />)}
        </div>
    )
}

export default ArrowList;