import React, { useState } from 'react';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';

import "../../styles/SearchBar.scss";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';
import SearchElements from '../../constants/searchTemplate';
import SearchDropdown from './SearchDropdown';
/**
 * 
 * @param {*} props - index and callback
 */
const SearchBar = (props) => {
    const store = useStore();
    const [results, setResults] = useState({ matches: [], suggest: [] });
    const [actionResult, setActionResult] = useState({ matches: [], suggest: [] });
    const [dropdown, setDropdown] = useState(false);
    const searchValues = (text) => {
        if (props.document) {
            const indexes = [
                'name', 'extension', 'title', 'text', 'url', "description",
                'fileName', 'labels', 'captions', 'author_url', 'author_name'
            ];

            const searchObject = new SearchElements(indexes);

            const [result, suggestions] = searchObject.getResult(text, store.cards);
            const [actionResult, actionSuggestion] = searchObject.getActionSearchResult(text);

            console.log("Suggestion", suggestions);
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
    return (
        <div className="menu-bar-searchbox ">
            <div className="search-input" style={props.dashboard ? {border: "2px solid black"} : {}}>
                <img className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
                <InlineTextEdit
                    style={{fontSize: "11px", fontFamily: "Open Sans"}}
                    borderColor='black'
                    placeholder={props.document ? "Search for an item or action" : "Search by project name"}
                    onChange={(e) => searchValues(e.target.value)}
                />
            </div>
            {
                (results.matches.length || actionResult.matches.length)
                    ? <SearchDropdown
                        results={results} actionResult={actionResult} document={props.document} dashboard={props.dashboard}
                        dropdown={dropdown}
                        setDropdown={setDropdown}
                    />
                    : null
            }
        </div>
    )
}
export default React.memo(observer(SearchBar));