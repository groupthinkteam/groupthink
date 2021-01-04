import { observer } from "mobx-react-lite";
import React, { useState } from "react"
import { useStore } from "../../store/hook";
import ToggleButton from "../Toggle/ToggleButton";

function Zoom(props) {
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