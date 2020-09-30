import React,{useState} from 'react';
import ReactPlayer from 'react-player/lazy';

/**
 * This Uploads The Video File in Storage And also can Stream the File.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const VideosCard = (props) =>{
    const [uploading, setUploading] = useState(false);
    const listOfExtension = "video/* "
    const requestUpload = (e) => {
        const file = e.target.files[0];
        var metadata = {
            contentType: file.type
        };
        let uploadPath = props.id + "/" + file.lastModified
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
            {uploading ? "upload progress: " + uploading : "not uploading"}
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
                    />                    
                </div>
                : null
            }
        </div>

    )
    
}
export default React.memo(VideosCard);
