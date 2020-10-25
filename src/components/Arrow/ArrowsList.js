import { observer } from "mobx-react-lite";
import React from "react"
import { useStore } from "../../store/hook"
import Arrow from "./Arrow"

const ArrowList = observer((props) => {
    let store = useStore();
    return (
        <div className="arrows">
            {Object.keys(store.cards).map((id) => <Arrow key={"arrow".concat(id)} id={"".concat(id)} />)}
        </div>
    )
})

export default ArrowList;