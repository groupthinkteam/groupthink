import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';
import { gsap, ScrollToPlugin } from "gsap/all"

import SearchItem from "./SearchItem";

gsap.registerPlugin(ScrollToPlugin)

const SearchDropdown = (props) => {
    const store = useStore();
    const [currentMatch, setCurrentMatch] = useState(0)

    const scrollToID = (id) => {
        let height = document.getElementById("card-container").style.height;
        let x = store.cards[id].position.x - window.innerWidth;
        let y = store.cards[id].position.y - height;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        gsap.to("#card-container", { duration: 2, scrollTo: { x: x, y: y } });

        props.setDropdown(false);
    }

    scrollToID(props.results.matches[currentMatch].id)

    let searchItems = []
    for (let i = 0; i < props.results.matches.length; i++) {
        let match = props.results.matches[i];
        const terms = match.terms[0];
        const field = match.match[terms][0];
        searchItems.push(
            (<SearchItem key={i} id={i} field={field} onClick={() => setCurrentMatch(i)} />)
        )
    }

    return (
        <>
            <div className={props.className}>
            {
              props.dropdown ? searchItems :null
            }
            </div>
            {currentMatch + 1}/{props.results.matches.length}
            <button onClick={() => setCurrentMatch((old) => (old + 1) % props.results.matches.length)}>
                Next
            </button>
            <button onClick={() => setCurrentMatch((old) => Math.abs(old - 1) % props.results.matches.length)}>
                Prev
            </button>
        </>
    )
}
export default observer(SearchDropdown);