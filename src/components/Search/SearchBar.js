import React, { useState } from 'react';
import { gsap, ScrollToPlugin } from "gsap/all"

import "../../styles/SearchBar.scss";
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';
import SearchElements from '../../constants/searchTemplate';
import "../../styles/Actions/ActionsMenu.scss"
import DashboardSearchBar from './DashboardSearchBar';
import DocumentSearchBar from './DocumentSearchBar';

gsap.registerPlugin(ScrollToPlugin)

/**
 * 
 * @param {*} props - index and callback
 */
const SearchBar = (props) => {
    const store = useStore();
    
    const [results, setResults] = useState({ matches: [], suggest: [] });
    const [actionResult, setActionResult] = useState({ matches: [], suggest: [] });
    
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
        <>
            {
                props.dashboard ?
                    <DashboardSearchBar
                        searchValues={searchValues}
                        results={results}
                        actionResult={actionResult}
                    />
                    : <DocumentSearchBar
                        setActionResult={setActionResult}
                        setResults={setResults}
                        scrollToID={scrollToID}
                        searchValues={searchValues}
                        results={results}
                        actionResult={actionResult}
                        recentSearches={store.recentSearches}
                        projectID={store.projectID}
                    />
            }
        </>
    )
    
}
export default React.memo(observer(SearchBar));