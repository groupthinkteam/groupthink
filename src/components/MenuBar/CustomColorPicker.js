import React, { useEffect , useRef } from 'react';
const CustomColorPicker = ({ store, id, close }) => {
    const colorRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if(colorRef.current && !colorRef.current.contains(event.target))
            close();
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [close]);
    const colorRect = {
        "#413D45": {
            x: "8",
            y: "36"
        },
        "#32AAFF": {
            x: "36",
            y: "8"
        },
        "#0C6FF9": {
            x: "36",
            y: "36"
        },
        "#FF7E1D": {
            x: "64",
            y: "8"
        },
        "#FC611E": {
            x: "64",
            y: "36"
        },
        "#FEACD5": {
            x: "92",
            y: "8"
        },
        "#FB7BBB": {
            x: "92",
            y: "36"
        },
        "#FFCE00": {
            x: "120",
            y: "8"
        },
        "#FFA441": {
            x: "120",
            y: "36"
        },
        "#71E05E": {
            x: "148",
            y: "8"
        },
        "#48BB35": {
            x: "148",
            y: "36"
        }
    }
    return (
        <div data-tip="Color" ref={colorRef} className="colorPicker popover" >
            <div onClick={close} />
            <svg width="180" height="68" viewBox="0 0 180 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="179" height="67" rx="3.5" fill="#FCFBF9" />
                <g clip-path="url(#clip0)">
                    <rect onClick={() => { store.saveCardColors(id, null) }} x="8" y="8" width="40" height="40" rx="3" fill="#FCFBF9" />
                    <line onClick={() => { store.saveCardColors(id, null) }} cursor="pointer" x1="9" y1="31.2929" x2="30.2929" y2="10" stroke="#FC611E" stroke-linecap="round" />
                </g>
                <rect onClick={() => { store.saveCardColors(id, null) }} x="8.5" y="8.5" width="23" height="23" rx="2.5" stroke="#413D45" />
                {
                    Object.entries(colorRect)
                        .map(([key, value]) =>
                            <rect id={key} onClick={() => { store.saveCardColors(id, key) }} x={value.x} y={value.y} width="24" height="24" rx="3" fill={key} />
                        )
                }<rect x="0.5" y="0.5" width="179" height="67" rx="3.5" stroke="#413D45" />
                <defs cursor="pointer">
                    <clipPath id="clip0">
                    </clipPath>
                </defs>
            </svg>
        </div>

    )
}
export default CustomColorPicker;