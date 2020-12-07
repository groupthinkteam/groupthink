import React, { useEffect } from 'react'
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import "../../styles/Search/Dashboard.scss";
import { useStore } from '../../store/hook';

const DashboardSearchBar = (props) => {
    const { searchValues, results } = props;

    const store = useStore();
    useEffect(() => {
        store.filterProject(results)
    }, [results, store])
    return (
        <div className='dashboard-search'>
            <div className="searchbox">
                <img className="icon" alt="magnifying glass" src={require("../../assets/search-icon.svg")} />
                <input
                    className="input"
                    type="text"
                    placeholder="Search projects"
                    onChange={(e) => searchValues(e.target.value)}
                />
            </div>
        </div>
    )
}
export default DashboardSearchBar;