import { observer } from "mobx-react-lite";
import React from "react"
import { useStore } from "../../store/hook"
import CollapsedCard from "./CollapsedCard";
import GenericCard from "./GenericCard";
import './minimap.scss'
import Minimap  from 'react-minimap';

function CardsList() {
    let store = useStore();
    return(
        
        <div className="cards">
            <Minimap selector=".generic-card" >
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
            </Minimap>
        </div>
        
    )
}

export default observer(CardsList);