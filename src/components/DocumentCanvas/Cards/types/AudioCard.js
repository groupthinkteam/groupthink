import React, { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';

const AudiosCard = (props) => {
    console.log("PROPS", props)

    let [uploading, setUploading] = useState(false);

    const listOfExtension = "audio/* "
    const requestUpload = (e) => {
        const file = e.target.files[0];
        console.log(file)
        var metadata = {
            contentType: file.type
        };
        let uploadPath = props.id + "/" + file.lastModified
        props.typeAPI.requestUpload(uploadPath, file, metadata, (percentProgress) => {
            if (percentProgress === 100) {
                setUploading("uploaded")
                props.typeAPI.requestDownload(
                    uploadPath,
                    (url, metadata) => props.typeAPI.saveContent(props.id, { url: url, metadata: metadata })
                )
            }
            else {
                setUploading(percentProgress)
            }
        })
    }

    return (
        <div>
            {uploading ? "upload progress: " + uploading : "not uploading"}
            <input
                type="file"
                accept={listOfExtension}
                onChange={(e) => requestUpload(e)}
            />
            { props.content.url ?
                <div key={props.content.metadata.name}>
                    File Name : {props.content.metadata.name}
                    <ReactAudioPlayer
                        src={props.content.url}
                        autoPlay={false}
                        controls={true}
                    />
                </div>
                : null
            }
        </div>

    )
}
export default AudiosCard;
/**
 *  {
                    (audioState != null || audioState != undefined) && audioState.length>0?
                    <div>
                        Previously Uploaded Audios
                        {
                            audioState
                            .map((item)=>(
                                <div key={item.metadata.name}>
                                    File Name : {item.metadata.name}
                                    <ReactAudioPlayer
                                        src={item.url}
                                        autoPlay={false}
                                        controls={true}
                                        style={{width:`${props.CardDetail?.size.width}px`}}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    :<div></div>
                }
                {
                    state?.src != undefined ? <ShowFileUploaded src={state} cardAPI={props.cardAPI} width={props.CardDetail?.size.width}  projectID={props.projectID} id={props.id}/> : <div></div>
                }
 */
