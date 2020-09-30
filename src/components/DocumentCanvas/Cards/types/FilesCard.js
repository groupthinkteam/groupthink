import React, { useState} from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
/**
 * This File Input's the Files(e.g. `.odt,.doc,.docx`) And Features to download the file .
 * @param {*} props 
 */
const FilesCard = (props) => {
  const [uploading, setUploading] = useState(false);
  const listOfExtension = ".odt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
  //console.log("Metadat FileCard",props.content.metadata)
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
        { 
            props.content.text === undefined ?
            Object.entries(props.content).map((fileKey,val)=>{
                return(
                    <div key={fileKey[0]}>
                        File Name : 
                        <a href={fileKey[1]?.url} target="_blank">{fileKey[0].split(">")[0]}</a>                   
                    </div>
                )
            })
            : null
        }
    </div>
  )
}
export default React.memo(FilesCard);