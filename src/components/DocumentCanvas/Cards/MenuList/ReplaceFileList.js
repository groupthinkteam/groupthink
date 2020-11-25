import React, { useState, useCallback, useRef } from "react";
import { gsap } from "gsap/all";

import { detectDimension, getTypeFromMetadata, resizeDimension } from "../cardTypeUtils";

function ReplaceFileList(props) {
    const defaultSize = {
        file: {
            height: 60,
            width: 200
        },
        audio: {
            height: 142,
            width: 300
        }
    };

    let inputFile = useRef(null);
    let [uploadState, setUploadState] = useState(false)

    const upload = useCallback((files) => {
        let file = files[0], displayHeight = null, displayWidth = null, originalHeight = null, originalWidth = null;;
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
    }, [props.id, props.typeAPI, defaultSize])

    if (uploadState) {
        gsap.to("#uploadfiller".concat(props.id), { height: uploadState + "%" })
    }
    const fileSet = {
        image : 'image',
        file:'file',
        VideoFile:'VideoFile',
        audio:'audio'
    }
    if(fileSet[props.type])
    return (

        <div>
            <span onClick={() =>{ inputFile.current.click() ; }}>
                Replace File
            </span>
            <input type="file"
                onChange={(e) => {upload(e.target.files); props.closeContextMenu();}}
                ref={inputFile}
                style={{ display: 'none' }} />
            <hr/>
        </div >
    )
    else
    return '';
}

export default React.memo(ReplaceFileList);