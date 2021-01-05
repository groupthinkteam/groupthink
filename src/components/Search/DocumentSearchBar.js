import React, { useState } from 'react'
import SearchDropdown from './SearchDropdown';
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
        recentSearches, projectName } = props;
    const closeSearchBar = (id) => {
        setActionResult({ matches: [], suggest: [] });
        setResults({ matches: [], suggest: [] })
        setExpanded(false);
        if (id)
            scrollToID(id);
    }

    return (
        <div data-delay-show='750' data-effect="solid" data-tip={!expanded?`Search In ${projectName}`:null} className="menu-bar-searchbox ">
            <div className="search-input">
                <svg className="searchbar-search-icon" alt="magnifying glass"
                    onClick={() => setExpanded(true)}
                    width="27" height="27" viewBox="0 0 27 27" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.3784 21.027C17.1549 21.027 21.027 17.1549 21.027 12.3784C21.027 7.60186 17.1549 3.72973 12.3784 3.72973C7.60187 3.72973 3.72974 7.60186 3.72974 12.3784C3.72974 17.1549 7.60187 21.027 12.3784 21.027Z" stroke="#32AAFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M23.1892 23.1892L18.4865 18.4865" stroke="#32AAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
                                <img onClick={() => setExpanded(true)} className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search/search-icon.svg")} />
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