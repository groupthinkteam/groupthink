import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';
import DisabledCard from '../Card/DisabledCard';

const SearchDropdown = (props) => {
    const store = useStore();

    const setSearchedItem = (id) => {
        store.addToRecentSearch(id);
        props.closeSearchBar(id);
    }

    // used to filter matches, so that any card is shown at most once
    let visitedMatchIDs = []

    const searchItems = [];
    for (let i = 0; i < props.results.matches.length; i++) {
        const match = props.results.matches[i];
        //const terms = match.terms[0];
        //const field = match.match[terms][0];
        if (visitedMatchIDs.includes(match.id)) continue;
        else {
            visitedMatchIDs.push(match.id)
            searchItems.push((
                <div className="search-item">
                    <DisabledCard key={i} id={match.id} handleClick={() => { setSearchedItem(match.id) }} />
                </div>
            ))
        }
    }

    return (
        <div className="search-dropdown">
            <div className="search-results">
                {searchItems}
            </div>
        </div>
    )
}
export default observer(SearchDropdown);