import React, { useEffect, useState } from "react"
import "../../styles/Toggle/ToggleButton.scss"
import ReactTooltip from "react-tooltip"
import { gsap } from "gsap/all"

// props: 
// id: a unique id
// onToggle(bool): callback
// default: bool (initial value) (false if not specified)
// tooltip: "tooltip text string"
export default function ToggleButton(props) {

    // false is default is not specified
    let [isOn, setIsOn] = useState(!!props.default)

    useEffect(() => {
        if (isOn) {
            gsap.to("#togglebody" + props.id, { backgroundColor: "#FB7BBB", duration: 0.5 })
            gsap.to("#togglenub" + props.id, { backgroundColor: "#ffffff", left: "12", duration: 0.2 })
        }
        if (!isOn) {
            gsap.to("#togglebody" + props.id, { backgroundColor: "#ffffff", duration: 0.5 })
            gsap.to("#togglenub" + props.id, { backgroundColor: "#FB7BBB", left: "4", duration: 0.2 })
        }
    }, [isOn, props.id])

    return (
        <>
        <ReactTooltip id={"toggle" + props.id} effect="solid" delayShow={200} delayUpdate={200}  eventOff="click"  place="top" />
        <div id={"toggle" + props.id}
            className="toggle-button"
            data-place="top" data-delay-show='750'
            data-effect="solid" data-tip={props.tooltip}
            onClick={() => {
                props.onToggle(!isOn)
                setIsOn(!isOn)
            }}>
            <div className="toggle-body" id={"togglebody" + props.id}>
                <div className="toggle-nub" data-delay-show='750' data-tip={null} id={"togglenub" + props.id} />
            </div>
        </div>
        </>
    )
}