
import React, { useEffect, useState } from 'react';
import MiniSearch from 'minisearch';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';

import "../../styles/SearchBar.scss";


/**
 * 
 * @param {*} props - index and callback
 */
const SearchBar = (props) => {
    const searchElement = (text) => {
        let miniSearch = new MiniSearch({
            fields: props.fields,
            storeFields: props.storeFields
        });

        miniSearch.addAll(props.documents)

        const results = miniSearch.search(text, { fuzzy: 0.2 });
        console.log("THE SEARCH ELEMENTS ", results, text);
    }
    return (
        <div className="menu-bar-searchbox">
            <img className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
            <InlineTextEdit
                borderColor='black'
                placeholder="Search for an item or action"
            // onChange={(e) => searchElement(e.target.value)}
            />
        </div>
    )
}
export default React.memo(SearchBar);