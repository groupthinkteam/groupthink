import React, { useState, useEffect } from 'react';
import { auth } from 'firebase';
const ShowFileUploaded = (props) => {
  let [state, setState] = useState()
  var file = props.src.src;
  let url = 0;
  const cardAPI = props.cardAPI;

  const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "files/" + file.name
  var metadata = {
    contentType: `${props.src.src.type}`
  };
  // Listen for state changes, errors, and completion of the upload.
  useEffect(() => {
      cardAPI.storeFile(refURL,file, metadata,data=>{
        setState(data)
      })
  }, [url])


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
  const cardAPI = props.cardAPI;

  const OnSelectFile = (e) => {
    setState({ src: e.target.files[0] })
    console.log(e.target.files[0])

  }
  const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "files/"
  useEffect(() => {
    cardAPI.displayFile(refURL,data=>{
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
        state?.src != undefined ? <ShowFileUploaded src={state} cardAPI={props.cardAPI} projectID={props.projectID} id={props.id} /> : <div></div>
      }
    </div>

  )
}
export default FilesCard;