import React, { useState } from 'react';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import { gsap, ScrollToPlugin } from "gsap/all"

import "../../styles/SearchBar.scss";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';
import SearchElements from '../../constants/searchTemplate';
import SearchDropdown from './SearchDropdown';
import Popup from '../PopupMenu/PopupMenu';
import "../../styles/Actions/ActionsMenu.scss"

gsap.registerPlugin(ScrollToPlugin)

/**
 * 
 * @param {*} props - index and callback
 */
const SearchBar = (props) => {
    const store = useStore();
    const [expanded, setExpanded] = useState(false);
    const [results, setResults] = useState({ matches: [], suggest: [] });
    const [actionResult, setActionResult] = useState({ matches: [], suggest: [] });
    const [dropdown, setDropdown] = useState(false);

    const scrollToID = (id) => {
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

    }
    const searchValues = (text) => {
        if (props.document) {
            const indexes = [
                'name', 'extension', 'title', 'text', 'url', "description",
                'fileName', 'labels', 'captions', 'author_url', 'author_name'
            ];

            const searchObject = new SearchElements(indexes);

            const [result, suggestions] = searchObject.getResult(text, store.cards);
            const [actionResult, actionSuggestion] = searchObject.getActionSearchResult(text);

            console.log("Suggestion", text, suggestions, actionSuggestion);
            setActionResult({ matches: actionResult, suggest: actionSuggestion });
            setResults({ matches: result, suggest: suggestions });
            setDropdown(result.length > 0 || actionResult.length > 0);
        }
        else {
            const indexes = ['name'];

            const searchObject = new SearchElements(indexes);
            const [result, suggestions] = searchObject.getResult(text, store.projects);

            setResults({ matches: result, suggest: suggestions });
            store.highlightSearched(result, 'projects');
        }

    }
    const closeSearchBar = (id) => {
        setDropdown(false)
        setActionResult({ matches: [], suggest: [] });
        setResults({ matches: [], suggest: [] })
        setExpanded(false);
        if (id)
            scrollToID(id);
    }

    return (
        <div className={props.dashboard ? 'new' : "menu-bar-searchbox "}>
            <div className={props.dashboard ? "new-search-input" : "search-input"} style={props.dashboard ? { border: "2px solid black" } : {}}>
                <img onClick={() => setExpanded(true)} className={"searchbar-search-icon"} alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
                {
                    props.dashboard ?
                        <InlineTextEdit
                            style={{ fontSize: "14px", fontFamily: "Overpass", margin: '5px 7px 7px' }}
                            borderColor='black'
                            placeholder={"Type in a name, keyword, or description"}
                            onChange={(e) => searchValues(e.target.value)}
                        /> : null
                }
            </div>
            {
                expanded && props.document ?
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
                                            results={results} actionResult={actionResult} document={props.document} dashboard={props.dashboard}
                                            dropdown={dropdown}
                                            setDropdown={setDropdown}
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
                                    Object.entries(store.recentSearches)
                                        .filter(([_, projectID]) => projectID === store.projectID)
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
            {/* {
                (results.matches.length || actionResult.matches.length) && props.dashboard
                    ? <SearchDropdown
                        results={results} actionResult={actionResult} document={props.document} dashboard={props.dashboard}
                        dropdown={dropdown}
                        setDropdown={setDropdown}
                        closeSearchBar={closeSearchBar}
                    />
                    : null
            } */}
        </div>
    )
}
export default React.memo(observer(SearchBar));