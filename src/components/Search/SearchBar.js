import React, { useState } from 'react';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';

import "../../styles/SearchBar.scss";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook'
import { searchElementinDocuments } from '../../constants/searchTemplate';
import SearchedItem from './SearchDropdown';
/**
 * 
 * @param {*} props - index and callback
 */
const SearchBar = (props) => {
    const store = useStore();
    const [results, setResults] = useState({ matches: [], suggest: [] });
    const [dropdown, setDropdown] = useState(false);
    const searchElement = (text) => {
        console.log("SEARCH ", text)
        if (props.document) {

            store.getActionQuery(data => console.log("ACTION QUERY ", data));
            const [result, suggestions] = searchElementinDocuments(text, store.cards,
                [
                    'name', 'extension', 'title', 'text', 'url', "description",
                    'fileName', 'labels', 'captions', 'author_url', 'author_name'
                ]
            );
            console.log("AUTO SUGGEST ", suggestions);

            setResults({ matches: result, suggest: suggestions });
            setDropdown(result.length > 0);
            store.highlightSearched(result, 'document');
        }
        else {
            const [result, suggestions] = searchElementinDocuments(text, store.projects, ['name']);
            console.log("AUTO SUGGEST ", suggestions);
            setResults({ matches: result, suggest: suggestions });

            store.highlightSearched(result, 'projects');
        }

    }
    console.log("DRP ", dropdown)
    return (
        <div className="menu-bar-searchbox ">
            <img className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
            <InlineTextEdit
                borderColor='black'
                placeholder="Search for an item or action"
                onChange={(e) => searchElement(e.target.value)}
            />
            {
                results.matches.length && <SearchedItem results={results} className="dropdown-content" dropdown={dropdown} setDropdown={setDropdown} />

            }


        </div>
    )
}
export default React.memo(observer(SearchBar));