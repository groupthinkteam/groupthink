import React, { useState, useCallback, useRef } from "react";
import { gsap } from "gsap/all";
import "../../../../styles/Cards/BlankCard.scss";

import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit";
import { detectDimension, getTypeFromURL, getMetadataFromURL, getTypeFromMetadata, resizeDimension } from "../cardTypeUtils";

const defaultSize = {
    text: {
        height: 150,
        width: 200
    },
    todo: {
        height: 300,
        width: 230
    },
    file: {
        height: 50,
        width: 250
    },
    audio: {
        height: 113,
        width: 300
    },
    link: {
        height: 112,
        width: 400
    }
};

/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
function BlankCard(props) {

    let inputFile = useRef(null);
    let [uploadState, setUploadState] = useState(false)

    const onChange = (e) => {
        e.persist()
        if (e.target.value === "") return;
        else {
            const outcome = getTypeFromURL(e.target.value);
            if (outcome === 'NoLink') {
                props.typeAPI.changeType(props.id, "text", defaultSize["text"], { text: `${e.target.value}`, initialRender: true })
            }
            else if (outcome === 'VideoLink') {
                getMetadataFromURL(e.target.value, metadata => {
                    const [height, width] = resizeDimension(metadata.height, metadata.width)
                    props.typeAPI.changeType(
                        props.id,
                        'VideoLink',
                        { height: height + 40, width: width + 20 },
                        { url: e.target.value, metadata: metadata, displayHeight: height, displayWidth: width }
                    )
                })
            }
            else {
                props.typeAPI.changeType(props.id, "link", defaultSize["link"], { url: e.target.value })
            }
        }
    }

    const onSave = () => {
        return;
    }

    const upload = useCallback((files) => {
        let file = files[0], displayHeight = null, displayWidth = null, originalHeight = null, originalWidth = null;
        console.log("triggered file upload")
        console.log(file)
        if (!file) return;

        const type = getTypeFromMetadata(file?.type);

        detectDimension(type, file, data => {
            originalHeight = data.height;
            originalWidth = data.width;
            [displayHeight, displayWidth] = resizeDimension(originalHeight, originalWidth);
        });

        let uploadPath = props.id + "/" + file.name;
        var typemeta = {
            contentType: file.type
        };
        props.typeAPI.requestUpload(uploadPath, file, typemeta,
            (status) => {
                if (typeof status === "number")
                    setUploadState(status);
                else {
                    props.typeAPI.requestDownload(
                        uploadPath,
                        (url, metadata) => {
                            props.typeAPI.changeType(props.id, type, defaultSize[type] || {
                                height: displayHeight + 60,
                                width: displayWidth + 20,
                            }, {
                                url: url,
                                metadata: metadata,
                                height: originalHeight,
                                width: originalWidth,
                                displayHeight: displayHeight,
                                displayWidth: displayWidth,
                            })
                        }
                    )
                }
            });
    }, [props.id, props.typeAPI])

    if (uploadState) {
        gsap.to("#uploadfiller".concat(props.id), { width: uploadState + "%" })
        gsap.to("#kiteloader".concat(props.id), { left: Math.min(uploadState, 90) + "%" })
    }

    return (
        uploadState
            ? <div className="blank-uploader" style={{ position: "relative", height: "100%", width: "100%", display: "flex", flexFlow: "row nowrap", justifyContent: "center", alignItems: "center" }}>
                <div style={{ position: "relative", zIndex: 3, fontFamily: "Overpass" }}>Uploading...</div>
                <img id={"kiteloader".concat(props.id)} className="upload-kite" src={require("../../../../assets/loaders/kite.svg")} alt="a kite" />
                <div id={"uploadfiller".concat(props.id)} className="upload-filler" />
            </div>
            :
            <div className="blankcard">
                <div className="text-edit">
                    <InlineTextEdit
                        onChange={e => onChange(e)}
                        onSave={onSave}
                        placeholder="Start typing, paste a link, or..."
                        margin="2px 0px 0px 0px"
                    />
                </div>
                <button className="upload-button" onClick={() => inputFile.current.click()}>
                    Upload
                </button>
                <input type="file"
                    onChange={(e) => upload(e.target.files)}
                    ref={inputFile}
                    style={{ display: 'none' }} />
            </div >
    )
}

export default React.memo(BlankCard);