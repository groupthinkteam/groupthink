import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/src/styles.scss';
import ProgressBar from 'react-bootstrap/ProgressBar'
/**
 * This File Shows the Input of Audio File .
 * @param {*} props 
 */
const AudioCard = (props) => {
    let [uploading, setUploading] = useState(false);

    const listOfExtension = "audio/* "
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
                        <AudioPlayer
                            src={fileKey[1]?.url}
                            showDownloadProgress="false"
                            preload="metadata"
                        />
                        </div>
                    )
                })
                : null
            }
        </div>

    )
}
export default React.memo(AudioCard);
