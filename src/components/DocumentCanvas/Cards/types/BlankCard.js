import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from 'react-dropzone'

import Button from "../../../Button/Button";
import "../../../../styles/Cards/BlankCard.scss"

import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit";
import { extensionDetector, typeDetector } from "../Detector";

/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
function BlankCard(props) {

    const types = {
        text: {
            height: 200,
            width: 280
        },
        todo: {
            height: 300,
            width: 230
        },
        file: {
            height: 100,
            width: 280
        },
        image: {
            height: 300,
            width: 350
        },
        VideoFile: {
            height: 200,
            width: 350
        },
        VideoLink: {
            height: 250,
            width: 350
        },
        pdf: {
            height: 208,
            width: 300
        },
        audio: {
            height: 142,
            width: 300
        },
        link: {
            height: 157,
            width: 340
        }
    };

    let inputFile = useRef(null);
    let [uploadState, setUploadState] = useState(false)

    const onChange = (e) => {
        props.typeAPI.changeContent(props.id, { text: e.target.value })
    }

    const onSave = () => {
        const outcome = extensionDetector(props.content.text);
        if (outcome === 'NoLink') { props.typeAPI.saveContent(props.id, { text: props.content.text }) }
        else {
            props.typeAPI.changeType(props.id, outcome, types[outcome])
            props.typeAPI.saveContent(props.id, { url: props.content.text });
        }
    }

    const upload = (files) => {
        let file = files[0]
        let uploadPath = props.id + "/" + file.name.split(".")[0] + ">" + file.lastModified + "/";
        var typemeta = {
            contentType: file.type
        };
        const type = typeDetector(file?.type);
        props.typeAPI.requestUpload(uploadPath, file, typemeta,
            (status) => {
                if (typeof status === "number")
                    setUploadState(status);
                else {
                    props.typeAPI.requestDownload(
                        uploadPath,
                        (url, metadata) => {
                            props.typeAPI.changeType(props.id, type, types[type])
                            props.typeAPI.saveContent(props.id, {
                                [metadata.name]: {url: url, metadata: metadata},
                                "text": null
                            })
                        }
                    )
                }
            });
    }

    const onDrop = useCallback(acceptedFiles => {
        upload(acceptedFiles)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div>
            <Button handleClick={() => props.typeAPI.changeType(props.id, "text", types["text"])}>
                Text
            </Button>
            <Button handleClick={() => props.typeAPI.changeType(props.id, "todo", types["todo"])}>
                Todo
            </Button>
            <Button handleClick={() => inputFile.current.click()}>
                Upload
            </Button>
            <input type="file"
                onChange={(e) => upload(e.target.files)}
                ref={inputFile}
                style={{ display: 'none' }} />
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
            <InlineTextEdit
                onChange={e => onChange(e)}
                onSave={onSave}
                placeholder="Paste a link here..."
            />
        </div>
    )
}

export default React.memo(BlankCard)