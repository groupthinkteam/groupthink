import React, { useState, useRef } from "react";
import Button from "../../../Button/Button";
import ProgressBar from 'react-bootstrap/ProgressBar'
import "../../../../styles/Cards/BlankCard.scss"

/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
function BlankCard(props) {
    let [uploading, setUploading] = useState(false);
    const inputFile = useRef(null);

    const types = {
        text: {
            height: 300,
            width: 350
        },
        file: {
            height: 300,
            width: 350
        },
        image: {
            height: 300,
            width: 350
        },
        VideoFile: {
            height: 300,
            width: 350
        },
        VideoLink: {
            height: 300,
            width: 350
        },
        pdf: {
            height: 300,
            width: 350
        },
        audio: {
            height: 300,
            width: 350
        },
        link: {
            height: 300,
            width: 350
        }
    };

    const requestUpload = (e) => {
        const file = e.target.files[0];
        if (file)
            var metadata = {
                contentType: file?.type
            };
        let uploadPath = props.id + "/" + file.name.split(".")[0] + ">" + file.lastModified + "/";
        const type = typeDetector(metadata.contentType);
        console.log("path sent from audio:", uploadPath)
        props.typeAPI.requestUpload(uploadPath, file, metadata, (uploadStatus) => {
            if (uploadStatus === "complete") {
                setUploading("uploaded")
                props.typeAPI.requestDownload(
                    uploadPath,
                    (url, metadata) => {
                        props.typeAPI.changeType(props.id, type, types[type])
                        props.typeAPI.saveContent(props.id, {
                            [metadata.name]:
                            {
                                url: url, metadata: metadata
                            },
                            ["/text"]: null
                        })
                    }
                )
            }
            else {
                setUploading(uploadStatus)
            }
        })
    }

    return (
        <div>
            <input type="file"
                onChange={(e) => requestUpload(e)}
                ref={inputFile}
                style={{ display: 'none' }} />
            <Button handleClick={() => inputFile.current.click()}>Upload</Button>
            {/* {Object.entries(types).map(([key, val]) =>
                    <Button key={key} handleClick={() => props.typeAPI.changeType(props.id, key, val)}>
                        {key}
                    </Button>
                )} */}
            <Button handleClick={() => props.typeAPI.changeType(props.id, "text", types["text"])}>
                Text
            </Button>
            {(typeof uploading === "number") ?
                <ProgressBar animated now={uploading} label={`${Math.floor(uploading)}%`}></ProgressBar>
                : null
            }
        </div>
    )
}

const typeDetector = (contentType) => {
    const fileSet = ["image", "video", "audio", "pdf"]
    let demoType = 'file';
    const fileType = contentType.split("/");
    console.log(fileType, fileType.length)
    for (let i = fileType.length - 1; i >= 0; i--) {
        if (fileSet.indexOf(fileType[i]) !== -1) {
            demoType = fileType[i]
        }
        else continue;
    }
    console.log(contentType, demoType)
    if (demoType === 'video')
        return 'VideoFile';
    else
        return demoType;
}
export default React.memo(BlankCard)