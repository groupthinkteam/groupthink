import { observer } from "mobx-react-lite";
import React from "react"
import { useStore } from "../../store/hook"
import GenericCard from "./GenericCard"

const CardsList = observer(props=> {
    let store = useStore();
    return (
        <div className="cards">
            {Object.keys(store.cards).map(id => <GenericCard key={id} id={id} />)}
        </div>
    )
})

export default CardsList;