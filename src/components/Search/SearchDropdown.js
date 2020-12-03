import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';
import { gsap, ScrollToPlugin } from "gsap/all"

import SearchItem from "./SearchItem";
import { useHistory, useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollToPlugin)

const SearchDropdown = (props) => {
    const store = useStore();
    // const history = useHistory();
    // const location = useLocation();
    // const [currentMatch, setCurrentMatch] = useState(0)
    // const [previousMatchID, setPreviousMatchID] = useState(null)

    // const openProject = (id) => {
    //     history.push('/project/' + id, { from: location })
    // }

    const searchItems = [];
    for (let i = 0; i < props.results.matches.length; i++) {
        let match = props.results.matches[i];
        const terms = match.terms[0];
        const field = match.match[terms][0];
        searchItems.push(
            (
                <SearchItem key={i} id={match.id} field={field} match={terms}
                    onClick={() => { store.addToRecentSearch(match.id); props.closeSearchBar(match.id);}} //props.document ? setCurrentMatch(i) : openProject(match.id) }}
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