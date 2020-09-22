import React, { useState, useEffect } from 'react';
const ShowFileUploaded = (props) => {
  const [state, setState] = useState()
  var file = props.src.src;
  var metadata = {
    contentType: `${props.src.src.type}`
  };
  // Listen for state changes, errors, and completion of the upload.
  useEffect(() => {
      props.uploadFile(file, metadata,data=>{
        setState(data)
      })
  }, [])


  return (
    <>
      <div style={{ display: "grid" }}>
        {
          state?.url != undefined ?
            <div style={{ display: "grid" }} >
              Name :- {state.metadata.name}
              <a href={state.url}>Download The File</a>
            </div>
            : <div>File is Uploading </div>
        }
      </div>
    </>
  )
}
const FilesCard = (props) => {
  const [state, setState] = useState()
  const [fileState, setFile] = useState([])
  const listOfExtension = ".odt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  
  const OnSelectFile = (e) => {
    setState({ src: e.target.files[0] })
    console.log(e.target.files[0])

  }
  
  useEffect(() => {
    props.fetchFile(data=>{
      setFile(data)
    })
  }, [])
  return (

    <div style={{ display: "grid" }}>
      <input
        type="file"
        accept={listOfExtension}
        onChange={(e) => OnSelectFile(e)}
      />
      {
        (fileState != null || fileState != undefined)
          ?
          <div>
            {
              fileState
                .map((item) => (<div key={item.metadata.name}>
                  <a href={item.url} target="_blank">{item.metadata.name}</a>
                </div>))
            }
          </div>
          : <div></div>
      }
      {
        state?.src != undefined ? <ShowFileUploaded src={state} uploadFile={props.uploadFile.bind(this)} /> : <div></div>
      }
    </div>

  )
}
export default FilesCard;