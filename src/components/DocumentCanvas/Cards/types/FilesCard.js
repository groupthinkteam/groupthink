import React, { useState, useEffect } from 'react';
import { firbaseStorage, firebaseStoreRef } from '../../../../services/firebase';
import { auth } from 'firebase';
import Loading from '../../../Loading';
const ShowFileUploaded = (props) => {
  let [state, setState] = useState()
  var file = props.src.src;
  let url = 0;

  const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "files/" + file.name
  var metadata = {
    contentType: `${props.src.src.type}`
  };
  // Listen for state changes, errors, and completion of the upload.
  useEffect(() => {
    var spaceRef = firbaseStorage().ref(refURL).put(file, metadata);
    spaceRef.on(firbaseStorage.TaskEvent.STATE_CHANGED,
      function(snapshot)
      {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state)
        {
           case firbaseStorage.TaskState.SUCCESS:
           console.log("Upload is Success")
           url=1;
              break;
           case firbaseStorage.TaskState.PAUSED: // or 'paused'
           console.log('Upload is paused');
           break;
           case firbaseStorage.TaskState.RUNNING: // or 'running'
           console.log('Upload is running');
           break;

        }
      },
      function(error)
      {
        switch (error.code) {
        case 'storage/unauthorized':
           // User doesn't have permission to access the object
           break;

        case 'storage/canceled':
           // User canceled the upload
           break;


        case 'storage/unknown':
           // Unknown error occurred, inspect error.serverResponse
           break;
        }
      }, // or 'state_changed'
      () => {
        spaceRef.snapshot.ref.getDownloadURL()
          .then((url) =>
            spaceRef.snapshot.ref.getMetadata()
              .then((data) => {
                setState({ url: url, metadata: data })
              })
              .catch((err) => console.log("Error in Metadata", err))
          )
          .catch((err) => console.log("Error in DownLoadURL", err))
      }
    );

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
  const OnSelectFile = (e) => {
    setState({ src: e.target.files[0] })
    console.log(e.target.files[0])

  }
  const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "files/"
  useEffect(() => {
    var spaceRef = firbaseStorage().ref(refURL)
    spaceRef.listAll()
      .then((dir) => {
        //-------Files Exist-------
        if (dir.items.length > 0) {
          dir.items.forEach((fileRef, index) => {
            fileRef.getMetadata()
              .then((data) => {
                fileRef.getDownloadURL()
                  .then((url) => {
                    setFile(prev => ([
                      ...prev,
                      { metadata: data, url: url }]
                    ))
                  })
              })
          })
        }
        else {
          console.log("No Files Exist")
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  const ReturnFileInfo = () => {
    return Object.entries(fileState)
      .map((key, val) => {
        console.log(key[1].metadata)
        return (
          <div style={{ display: "grid" }} key={key[0]} >
            Uploaded File
            <b>Name : {key[1].metadata.name} </b>
            <a href={key[1].url}>Click Here To Download</a>
          </div>
        )
      })
  }
  //console.log("Filestate", fileState)
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
        state?.src != undefined ? <ShowFileUploaded src={state} projectID={props.projectID} id={props.id} /> : <div></div>
      }
    </div>

  )
}
export default FilesCard;
/*function(snapshot)
      {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state)
        {
           case firbaseStorage.TaskState.SUCCESS:
           console.log("Upload is Success")
           url=1;
              break;
           case firbaseStorage.TaskState.PAUSED: // or 'paused'
           console.log('Upload is paused');
           break;
           case firbaseStorage.TaskState.RUNNING: // or 'running'
           console.log('Upload is running');
           break;

        }
      },
      function(error)
      {
        switch (error.code) {
        case 'storage/unauthorized':
           // User doesn't have permission to access the object
           break;

        case 'storage/canceled':
           // User canceled the upload
           break;


        case 'storage/unknown':
           // Unknown error occurred, inspect error.serverResponse
           break;
        }
      },*/