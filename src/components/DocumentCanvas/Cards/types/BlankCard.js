import React, { useState, useRef } from "react";
import Button from "../../../Button/Button";
import "../../../../styles/Cards/BlankCard.scss"

// Import React FilePond
import { FilePond } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit";
import {extensionDetector, typeDetector } from "../Detector";

/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
function BlankCard(props) {
    const [files, setFiles] = useState([]);

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
            const type = typeDetector(file?.type);
            props.typeAPI.requestUpload(uploadPath, file, { ...metadata, ...typemeta },
                (status, taskCallback) => {
                    task = taskCallback
                    if (typeof status === "number")
                        progress(true, status, 100);
                    else
                    {
                        load(props.id);
                        props.typeAPI.requestDownload(
                            uploadPath,
                            (url, metadata) => 
                            {
                                props.typeAPI.changeType(props.id,type,types[type])
                                props.typeAPI.saveContent(props.id,{
                                    [metadata.name]: 
                                    { 
                                        url: url, metadata: metadata 
                                    },
                                    ["/text"] : null
                                })
                            }
                        )
                    }
                });
            return {
                abort: () => {
                    console.log("attempted to cancel upload, success:", task.cancel());
                    abort();
                }
            }
        }
    };
    const onChange = (e) =>{
        const outcome = extensionDetector(e.target.value);
        console.log("Print Text",outcome , e.target.value)
        
        props.typeAPI.changeContent(props.id, { text: e.target.value })
    }
    const onSave = () => {
        const outcome= extensionDetector(props.content.text);
        console.log("ON SAVE",outcome, props.content.text)
        if ( outcome === 'NoLink')
        {    props.typeAPI.saveContent(props.id, { text: props.content.text })}
        else
        {
            props.typeAPI.changeType(props.id,outcome,types[outcome])
            props.typeAPI.saveContent(props.id,{url:props.content.text});
            
        }
    }
    return (
        <div>
            <Button handleClick={() => props.typeAPI.changeType(props.id, "text", types["text"])}>
                Text
            </Button>
            <InlineTextEdit 
                onChange= {e=>onChange(e)} 
                onSave={onSave}
            />
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
export default React.memo(BlankCard)