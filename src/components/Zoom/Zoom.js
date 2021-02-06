import { observer } from "mobx-react-lite";
import React, { useState } from "react"
import { useStore } from "../../store/hook";
import ToggleButton from "../Toggle/ToggleButton";

function Zoom({ toggleMinimap, minimapViewer }) {
    const store = useStore()
    const [editing, setEditing] = useState(false)
    function validateInput(text) {
        let match = text.match(/[0-9]{1,3}/)
        console.log(match)
        return match;
    }

    function updateZoom(newZoom) {
        let val = validateInput(newZoom)
        if (val) {
            // clamp between 50, 150
            store.zoom = Math.min(Math.max(val, 50), 150) / 100
        }
    }
    return (
        <div className="zoom-widget" tabIndex="-1" >
            <ToggleButton id={"toggle" + store.projectID}
                default={true}
                tooltip={"Show all arrows. When disabled, only arrows linked to the selected card are visible."}
                onToggle={(newValue) => store.toggleArrows = newValue} />
            <div className="vertical-separator" />
            {/* Minimap Toggle Button SVG */}
            <svg
                data-place="top" data-delay-show='750'
                data-effect="solid" data-tip={minimapViewer?"Close Minimap":"View Minimap"}
                onClick={toggleMinimap} className={minimapViewer ? '' : "minimap-widget"}
                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={minimapViewer ? "minimap-open" : ''} d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z" stroke="#413D45" stroke-linecap="round" stroke-linejoin="round" />
                <path className={minimapViewer ? "minimap-open" : ''} d="M8 2V18" stroke="#413D45" stroke-linecap="round" stroke-linejoin="round" />
                <path className={minimapViewer ? "minimap-open" : ''} d="M16 6V22" stroke="#413D45" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div className="vertical-separator" />
            <img className="zoom-icon" onClick={() => updateZoom((store.zoom - .10) * 100 + "%")} src={require("../../assets/zoom/minus.svg")} alt="minus" />
            <input
                className="input"
                type="text"
                value={editing || store.zoom * 100 + "%"}
                onFocus={e => { setEditing(store.zoom * 100 + "%") }}
                onChange={e => { setEditing(e.target.value) }}
                onBlur={e => {
                    setEditing(false)
                    let val = validateInput(e.target.value)
                    if (val) {
                        store.zoom = Math.min(Math.max(val, 50), 150) / 100
                    }
                }}
            />
            <img className="zoom-icon" onClick={() => updateZoom((store.zoom + .10) * 100 + "%")} src={require("../../assets/zoom/plus.svg")} alt="plus" />
        </div>
    )
}

export default observer(Zoom)