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
        if(file != undefined)
        var metadata = {
            contentType: file?.type
        };
        let uploadPath = props.id + "/" + file.name.split(".")[0] +">"+file.lastModified+"/";
        console.log("path sent from audio:", uploadPath)
        props.typeAPI.requestUpload(uploadPath, file, metadata, (uploadStatus) => {
            console.log(uploadStatus)
            if (uploadStatus === "complete") {
                setUploading("uploaded")
                props.typeAPI.requestDownload(
                    uploadPath,
                    (url, metadata) => 
                    props.typeAPI.saveContent(props.id,{
                        [metadata.name]: 
                        { 
                            url: url, metadata: metadata 
                        },
                        ["/text"] : null
                    })
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
            { props.content.text === undefined ?
                Object.entries(props.content).map((fileKey,val)=>{
                    //console.log(fileKey[0] , fileKey[1]?.url )//
                    return (
                        <div key={fileKey[0]}>
                        File Name : {fileKey[0].split(">")[0]}
                        <ReactPlayer
                            controls={true}
                            url={fileKey[1]?.url}
                            ref={reactPlayerRef}
                        />
                        </div>
                    )
                })
                : null
            }
        </div>

    )
    
}
export default React.memo(VideosCard);
