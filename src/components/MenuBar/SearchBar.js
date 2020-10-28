
import React from 'react';
//import MiniSearch from 'minisearch';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';

import "../../styles/SearchBar.scss";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook'
import { searchElementinDocuments } from '../../constants/searchTemplate';

/**
 * 
 * @param {*} props - index and callback
 */
const SearchBar = (props) => {
    const store = useStore();
    const searchElement = (text) => {
        console.log("SEARCH ", text)
        if (props.document) {
            const [result,suggestions] = searchElementinDocuments(text, store.cards, ['name', 'extension', 'title', 'text', 'url', 'fileName'])
            console.log("AUTO SUGGEST ", suggestions);
            store.highlightSearched(result, 'document');
        }
        else {
            const [result,suggestions] = searchElementinDocuments(text, store.projects, ['name']);
            console.log("AUTO SUGGEST ", suggestions);
            store.highlightSearched(result, 'projects');
        }

    }
    return (
        <div className="menu-bar-searchbox">
            <img className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
            <InlineTextEdit
                borderColor='black'
                placeholder="Search for an item or action"
                onChange={(e) => searchElement(e.target.value)}
            />
        </div>
    )
}
export default React.memo(observer(SearchBar));