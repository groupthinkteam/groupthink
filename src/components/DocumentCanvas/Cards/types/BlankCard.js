import React, { useState } from "react";
import Button from "../../../Button/Button";
import ProgressBar from 'react-bootstrap/ProgressBar'
/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
function BlankCard(props) {
    let [uploading, setUploading] = useState(false);
    //let types = ["text", "image", "VideoLink", "VideoFile", "link", "audio", "pdf", "file"]
    
    const types = {};
    types["text"] = {
        height : 300,
        width : 350
    }
    types["file"] = {
        height : 300,
        width : 350
    }
    types["image"] = {
        height : 300,
        width : 370
    }
    types["VideoFile"] = {
        height : 300,
        width : 350
    }
    types["VideoLink"] = {
        height : 300,
        width : 350
    }
    types["pdf"] = {
        height : 300,
        width : 350
    }
    types["audio"] = {
        height : 300,
        width : 350
    }
    types["link"] = {
        height : 300,
        width : 350
    }
    const requestUpload = (e) => {
        const file = e.target.files[0];
        var metadata = {
            contentType: file.type
        };
        let uploadPath = props.id + "/" + file.name +"/";
        const type = typeDetector(metadata.contentType);
        console.log("path sent from audio:", uploadPath,type , types[type])
        props.typeAPI.requestUpload(uploadPath, file, metadata, (uploadStatus) => {
            console.log(uploadStatus)
            if (uploadStatus === "complete") {
                setUploading("uploaded")
                props.typeAPI.requestDownload(
                    uploadPath,
                    (url, metadata) =>{
                        props.typeAPI.changeType(props.id , type, types[type])
                        props.typeAPI.saveContent(props.id, { url: url, metadata: metadata })    
                    }
                )
            }
            else {
                setUploading(uploadStatus)
            }
        })
    }
    return (
        <>
        
        <div className="button_link">
            {Object.entries(types).map((key,val) =>
                <Button key={key[0]} handleClick={() => props.typeAPI.changeType(props.id, key[0] , key[1])}>
                    {key[0]}
                </Button>)}
                <input type="file" 
                    onChange = {(e)=>requestUpload(e)}
                />
        </div>
        {
            (typeof uploading === "number") ? 
            <ProgressBar animated now={uploading} label={`${Math.floor(uploading)}%`}></ProgressBar>  
            : null
        }
        </>
    )
}
const typeDetector = (contentType) =>{
    const fileSet =["image", "video","audio","pdf"]
    let demoType = 'file' ;
    const fileType = contentType.split("/") ;
    console.log(fileType, fileType.length)
    for(let i  =fileType.length-1; i >= 0 ; i-- )
    {
        if(fileSet.indexOf(fileType[i]) !== -1) 
        { 
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