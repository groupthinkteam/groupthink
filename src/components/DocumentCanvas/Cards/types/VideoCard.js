import React,{ useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player/lazy';
import ProgressBar from 'react-bootstrap/ProgressBar'
/**
 * This Uploads The Video File in Storage And also can Stream the File.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const VideosCard = (props) =>{
    const [uploading, setUploading] = useState(false);
    const listOfExtension = "video/* ";
    const reactPlayerRef = useRef(null);
    const resizeCard = (width , height) => props.typeAPI.resize(props.id , {width:width , height: height})
    useEffect(()=>{
        if(reactPlayerRef.current?.props != undefined)
        resizeCard(parseInt(reactPlayerRef.current?.props.width) , parseInt(reactPlayerRef.current?.props.height))
    },[reactPlayerRef.current])
    const requestUpload = (e) => {
        const file = e.target.files[0];
        var metadata = {
            contentType: file.type
        };
        let uploadPath = props.id + "/" + file.name + "/"
        console.log("path sent from audio:", uploadPath)
        props.typeAPI.requestUpload(uploadPath, file, metadata, (uploadStatus) => {
            console.log(uploadStatus)
            if (uploadStatus === "complete") {
                setUploading("uploaded")
                props.typeAPI.requestDownload(
                    uploadPath,
                    (url, metadata) => props.typeAPI.saveContent(props.id, { url: url, metadata: metadata })
                )
            }
            else {
                setUploading(uploadStatus)
            }
        })
    }
    
    return (
        <div>
            {
                (typeof uploading === "number") ? 
                <ProgressBar animated now={uploading} label={`${Math.floor(uploading)}%`}></ProgressBar>  
                : null
            }
            <input
                type="file"
                accept={listOfExtension}
                onChange={(e) => requestUpload(e)}
            />
            { props.content.url ?
                <div key={props.content.metadata.name}>
                    File Name : {props.content.metadata.name}
                    <ReactPlayer
                        controls={true}
                        url={props.content.url}
                        ref={reactPlayerRef}
                    />                    
                </div>
                : null
            }
        </div>

    )
    
}
export default React.memo(VideosCard);
