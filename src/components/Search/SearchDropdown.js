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

    const scrollToID = (id) => {
        let height = document.getElementById("card-container").style.height;
        let x = store.cards[id].position.x - window.innerWidth;
        let y = store.cards[id].position.y - height;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        gsap.to("#card-container", { duration: 2, scrollTo: { x: x, y: y } });

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
        <>
            <div className={props.className}>
                {searchItems}
                {actionItems}
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