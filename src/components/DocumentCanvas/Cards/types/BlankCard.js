import React, { useState, useRef } from "react";
import Button from "../../../Button/Button";
import ProgressBar from 'react-bootstrap/ProgressBar'
import "../../../../styles/Cards/BlankCard.scss"

// Import React FilePond
import { FilePond } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
function BlankCard(props) {
    let [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]);
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

    let server = {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            var typemeta = {
                contentType: file?.type
            };

            let uploadPath = props.id + "/" + file.name.split(".")[0] + ">" + file.lastModified + "/";
            let task;
            props.typeAPI.requestUpload(uploadPath, file, { ...metadata, ...typemeta },
                (status, taskCallback) => {
                    task = taskCallback
                    if (typeof status === "number")
                        progress(true, status, 100);
                    else
                        load(props.id)
                });
            return {
                abort: () => {
                    console.log("attempted to cancel upload, success:", task.cancel());
                    abort();
                }
            }
        }
    };

    return (
        <div>
            <Button handleClick={() => props.typeAPI.changeType(props.id, "text", types["text"])}>
                Text
                </Button>
            <FilePond
                files={files}
                allowMultiple={false}
                maxFiles={1}
                onupdatefiles={fileItems => setFiles(fileItems.map(fileItem => fileItem.file))}
                server={server} // todo: add custom server functionality using firebase
            />
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