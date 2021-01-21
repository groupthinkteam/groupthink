import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../store/hook';
import { gsap, Draggable } from "gsap/all";
import  './CustomDragSelect.scss';
const CustomDragSelect = () =>{
    const store = useStore();
    useEffect(() => { gsap.set("#customDragSelect", {height:12,width:12}) },[])
    
    return (
        <>
        <div
            className="disabledcard"
            id="customDragSelect"
        >
            <div id="bottom-drag"></div>
        </div>
        </>
    )
}
export default observer( CustomDragSelect)