import { observer } from "mobx-react-lite"
import React from "react"
import html2canvas from 'html2canvas';
function SearchItem(props) {
    const getCardImage = (divID, cardID) => {
        console.log("props ID ", props.id)
        if (typeof cardID === 'string') {
            var node = document.querySelector('#'.concat(cardID));
            html2canvas(node).then(function (canvas) {
                console.log("canvas ", canvas)
                document.getElementById(divID).appendChild(canvas);
            })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
        }
    }
    return (
        <div onLoad={getCardImage("matched-image", props.id)} id={"searchitem" + props.id} className="search-result-items" onClick={props.onClick}>
            <div className="matched-keywords" >
                <div id="matched-image" />
            </div>
            <hr className="search-result-separator" />
        </div>
    )
}

export default observer(SearchItem)