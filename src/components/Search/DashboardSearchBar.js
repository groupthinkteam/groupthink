import React, { useEffect } from 'react'
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import "../../styles/SearchBar.scss";
import { useStore } from '../../store/hook';

const DashboardSearchBar = (props) => {
    const { searchValues, results } = props;
    
    const store = useStore();
    useEffect(()=>{
        store.filterProject(results)
    },[results,store])
    return (
        <div  className='new'>
            <div className="new-search-input" style={{ border: "2px solid black" }}>
                <img className="searchbar-search-icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />

                <InlineTextEdit
                    style={{ fontSize: "14px", fontFamily: "Overpass", margin: '5px 7px 7px' }}
                    borderColor='black'
                    placeholder="Type to Search Project"
                    onChange={(e) => searchValues(e.target.value)}
                />

            </div>
        </div>
    )
}
export default DashboardSearchBar;