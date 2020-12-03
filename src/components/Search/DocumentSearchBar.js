import React, { useState } from 'react'
import SearchDropdown from './SearchDropdown';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import Popup from '../PopupMenu/PopupMenu';
import "../../styles/Actions/ActionsMenu.scss"
import "../../styles/SearchBar.scss";

const DocumentSearchBar = (props) => {
    const [expanded, setExpanded] = useState(false);
    const { setActionResult, setResults, scrollToID, searchValues,
        results,
        actionResult,
        recentSearches} = props;
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
                        <div className="actions-container">
                            <div className="title">
                                <img className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
                            Search
                        </div>
                            <div className="subtitle">
                                Search automatically extracts important keywords from your cards to help you find things easily.
                        </div>
                            <div className="new">
                                <div className="new-search-input" style={props.dashboard ? { border: "2px solid black" } : {}}>
                                    <img onClick={() => setExpanded(true)} className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
                                    <InlineTextEdit
                                        style={{ fontSize: "14px", fontFamily: "Overpass", margin: '5px 7px 7px' }}
                                        borderColor='black'
                                        placeholder={"Type in a name, keyword, or description"}
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
                            </div>
                            <div className="title">
                                Recent Searches
                        </div>
                            <div className="recent-search">
                                {
                                    Object.entries(recentSearches)
                                        .filter(([_, projectID]) => projectID === props.projectID)
                                        .map(([cardID, _]) =>
                                            <div key={cardID} onClick={() => closeSearchBar(cardID)} style={{ cursor: 'pointer' }} >
                                                {cardID}
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
export default DocumentSearchBar;