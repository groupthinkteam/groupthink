import React, { useState } from 'react'
import SearchDropdown from './SearchDropdown';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import Popup from '../PopupMenu/PopupMenu';

import "../../styles/Actions/ActionsMenu.scss"
import "../../styles/SearchBar.scss";
import html2canvas from 'html2canvas';
import { observer } from 'mobx-react-lite';
import GenericCard from '../Card/GenericCard';
import * as htmlToImage from 'html-to-image';
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


    const getCardImage = (divID,cardID) => {
        var node = document.querySelector('#'.concat(cardID));
        html2canvas(node).then(function (canvas) {
            console.log("canvas ",canvas)
            // var img    = node.toDataURL(canvas);
            // document.getElementById(divID).write('<img src="'+img+'"/>');
            document.getElementById(divID).appendChild(canvas);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
        htmlToImage.toJpeg(node).then(function (canvas) {
            console.log("canvas ",canvas)
            // var img    = node.toDataURL(canvas);
            // document.getElementById(divID).write('<img src="'+img+'"/>');
            var img = new Image();
            img.src = canvas;
            document.getElementById(divID).appendChild(img);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
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
                                            // <div onLoad={getCardImage("test-image",cardID)} key={cardID} onClick={() => closeSearchBar(cardID)} style={{ cursor: 'pointer' }} >
                                            //     {/* {cardID}  */}
                                            //     <div className="test-image" id="test-image"></div>
                                            // </div>
                                            <DisabledCard key={cardID} id={cardID} handleClick={() => closeSearchBar(cardID)}/>
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
export default observer( DocumentSearchBar);