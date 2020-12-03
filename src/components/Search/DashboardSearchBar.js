import React from 'react'
import SearchDropdown from './SearchDropdown';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import "../../styles/SearchBar.scss";

const DashboardSearchBar = (props) => {
    const { searchValues, results, actionResult } = props;
    return (
        <div className='new'>
            <div className="new-search-input" style={{ border: "2px solid black" }}>
                <img className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />

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
                        results={results} actionResult={actionResult} dashboard
                    />
                    : null
            }
        </div>
    )
}
export default DashboardSearchBar;