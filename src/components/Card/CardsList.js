import { observer } from "mobx-react-lite";
import React from "react"
import { useStore } from "../../store/hook"
import CollapsedCard from "./CollapsedCard";
import GenericCard from "./GenericCard";

function CardsList() {
    let store = useStore();
    
    return(
        <div className="cards">
            {
                Object.entries(store.cards)
                    .filter(([id, value]) => id && id !== "root" && !value?.isCollapse)
                    .map(([id, _]) => {
                        if(store.collapsedID[id])
                        return (<CollapsedCard key={id} id={id} cardsCollapsed={store.collapsedID[id]}/>)
                        else
                        return(<GenericCard key={id} id={id} />)
                    })
            }
        </div>
    )
}

export default observer(CardsList);