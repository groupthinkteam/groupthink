import React, { useState } from 'react'
import SearchDropdown from './SearchDropdown';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import Popup from '../PopupMenu/PopupMenu';

import "../../styles/Actions/ActionsMenu.scss"
import "../../styles/Search/Document.scss";
import { observer } from 'mobx-react-lite';
import DisabledCard from '../Card/DisabledCard';

const DocumentSearchBar = (props) => {
    const [expanded, setExpanded] = useState(false);
    const { setActionResult, setResults, scrollToID, searchValues,
        results,
        actionResult,
        recentSearches } = props;
    const closeSearchBar = (id) => {
        setActionResult({ matches: [], suggest: [] });
        setResults({ matches: [], suggest: [] })
        setExpanded(false);
        if (id)
            scrollToID(id);
    }

    return (
        <div className="menu-bar-searchbox ">
            <div className="search-input">
                <img onClick={() => setExpanded(true)} className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
            </div>
            {
                expanded ?
                    <Popup handleClose={() => { closeSearchBar() }}>
                        <div className="search-container">
                            <div className="title">
                                {/* <img className="search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} /> */}
                                Search
                            </div>
                            <div className="subtitle">
                                Search intelligently extracts important keywords from your cards to help you find things easily.
                            </div>
                            <div className="search-input">
                                <img onClick={() => setExpanded(true)} className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
                                <input className="input-text"
                                    placeholder="type in a name, keyword, or description"
                                    onChange={(e) => searchValues(e.target.value)}
                                />
                            </div>
                            {
                                (results.matches.length || actionResult.matches.length)
                                    ? <SearchDropdown
                                        results={results} actionResult={actionResult} document
                                        closeSearchBar={closeSearchBar}
                                    />
                                    : null
                            }
                            <div className="section-heading">
                                Recently Searched
                            </div>
                            <div className="recently-searched">
                                {
                                    Object.entries(recentSearches)
                                        .filter(([_, projectID]) => projectID === props.projectID)
                                        .map(([cardID, _]) =>
                                            <div className="search-item">
                                                <DisabledCard key={cardID} id={cardID} handleClick={() => closeSearchBar(cardID)} />
                                            </div>
                                        )
                                }
                            </div>
                        </div>
                    </Popup>
                    : null
            }

        </div>
    )
}
export default observer(DocumentSearchBar);