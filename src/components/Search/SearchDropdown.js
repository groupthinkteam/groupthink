import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';
import { gsap, ScrollToPlugin } from "gsap/all"

import SearchItem from "./SearchItem";
import { useHistory, useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollToPlugin)

const SearchDropdown = (props) => {
    const store = useStore();
    const history = useHistory();
    const location = useLocation();
    const [currentMatch, setCurrentMatch] = useState(0)
    const [previousMatchID, setPreviousMatchID] = useState(null)

    const scrollToID = (id) => {
        if (id !== previousMatchID) {
            let height = document.getElementById("card-container").style.height;
            let x = store.cards[id].position.x - window.innerWidth - 100;
            let y = store.cards[id].position.y - height - 100;
            x = x < 0 ? 0 : x;
            y = y < 0 ? 0 : y;
            let tl = gsap.timeline();
            tl.to("#card-container", { duration: 0.3, scrollTo: { x: x, y: y } });
            tl.to("#".concat(id), { scale: 1.3, duration: 0.3 });
            tl.to("#".concat(id), { scale: 1.0, duration: 0.1 })
            tl.play()
            setPreviousMatchID(id)
        }
        props.setDropdown(false);
    }

    const openProject = (id) => {
        history.push('/project/' + id, { from: location })
    }

    const searchItems = [];
    for (let i = 0; i < props.results.matches.length; i++) {
        let match = props.results.matches[i];
        const terms = match.terms[0];
        const field = match.match[terms][0];
        searchItems.push(
            (
                <SearchItem key={i} id={match.id} field={field} match={terms}
                    onClick={() => { props.document ? setCurrentMatch(i) : openProject(match.id) }}
                />
            )
        )
    }

    const actionItems = [];
    for (let i = 0; i < props.actionResult.matches.length; i++) {
        let match = props.actionResult.matches[i];
        const terms = match.terms[0];
        const field = match.match[terms][0];
        actionItems.push(
            (
                <SearchItem key={i} id={match.id} field={field}
                //Relevant Action onClick={() => {  }} 
                />
            )
        )
    }

    if (props.document && props.results.matches[currentMatch]?.id)
        scrollToID(props.results.matches[currentMatch]?.id)

    return (
        <div className="search-dropdown">
            <div className="search-results">
                {searchItems}
                {actionItems}
            </div>
            {/* {currentMatch + 1}/{props.results.matches.length} */}
            {/* <button onClick={() => setCurrentMatch((old) => (old + 1) % props.results.matches.length)}>
                Next
            </button>
            <button onClick={() => setCurrentMatch((old) => Math.abs(old - 1) % props.results.matches.length)}>
                Prev
            </button> */}
        </div>
    )
}
export default observer(SearchDropdown);