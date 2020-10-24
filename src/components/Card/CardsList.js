import React from "react"
import { useStore } from "../../store/hook"
import GenericCard from "./GenericCard"

function CardsList(props) {
    let store = useStore();
    return (
        <div className="cards">
            {Object.keys(store.cards).map(id => <GenericCard key={id} id={id} />)}
        </div>
    )
}

export default CardsList;