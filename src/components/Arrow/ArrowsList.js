import { observer } from "mobx-react-lite";
import React from "react"
import { useStore } from "../../store/hook"
import Arrow from "./Arrow"

function ArrowList(props) {
    const store = useStore();
    const showSelectedArrow = (id) =>{
        if(store.cards[id]?.children )
        return [
                Object.keys(store.cards[id]?.children)
                .filter((Id)=>!store.cards[Id].isCollapse)
                .map((Id) => {
                    return <Arrow key={"arrow".concat(Id)} id={"".concat(Id)} />
                })
                , <Arrow key={"arrow".concat(id)} id={"".concat(id)} />
            ]
        else
        return <Arrow key={"arrow".concat(id)} id={"".concat(id)} />
    }
    return (
        <div className="arrows">
            {
                Object.entries(store.cards)
                    .filter(([id, value]) => id && id !== "root" && !value?.isCollapse)
                    .map(([id, _]) => {
                        if (store.toggleArrows)
                            return <Arrow key={"arrow".concat(id)} id={"".concat(id)} />
                        else if (store.currentActive === id) {
                            return showSelectedArrow(id)
                        }
                        else return null

                    })
            }
        </div>
    )
}

export default observer(ArrowList);