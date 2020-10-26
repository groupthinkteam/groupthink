
import React from 'react';
//import MiniSearch from 'minisearch';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';

import "../../styles/SearchBar.scss";
import { observer } from 'mobx-react-lite';
import {useStore} from '../../store/hook'
import { searchElementinDocuments } from '../../constants/searchTemplate';

/**
 * 
 * @param {*} props - index and callback
 */
const SearchBar = observer(props => {
    const store = useStore();
    const searchElement = (text) => {
        console.log("SEARCH ",text)
        if(props.document)
        {
            searchElementinDocuments(text,store.cards,['content.name','content.title','text'])
        }
        else
        {
            searchElementinDocuments(text,store.projects,['content.name']);
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
})
export default React.memo(SearchBar);