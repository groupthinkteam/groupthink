import React,{useState,useEffect} from 'react';
import { firbaseStorage , firebaseStoreRef } from '../../../../services/firebase';
import { auth } from 'firebase';
const ShowFileUploaded = (props) =>{
    let [state , setState] =useState()
    var file = props.src.src;
    var httpsRefrence;
    let url=0;
    
    const refURL = auth().currentUser?.uid+"/"+props.projectID+"/"+props.id+"/"+"files/"+file.name
    var metadata = {
        contentType: `${props.src.src.type}`
      };
    //var spaceRef = firbaseStorage().ref(refURL).put(file,metadata);
    // Listen for state changes, errors, and completion of the upload.
    useEffect(()=>{
        var spaceRef = firbaseStorage().ref(refURL).put(file,metadata);
        spaceRef.on( firbaseStorage.TaskEvent.STATE_CHANGED, // or 'state_changed'
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
        },
        ()=>spaceRef.snapshot.ref.getDownloadURL().then((url)=> setState({url:url}))
    );
    },[url])
    
    
    return(
        <>
      <div>
        {
        state?.url != undefined ? 
        <div >
            <a href={state.url}>Download The File</a> 
        </div> 
        : <div>File is Uploading </div>
        }
      </div>
      </>
    )
 }
const FilesCard = (props) =>{
    const [state , setState]= useState()
    const listOfExtension= ".odt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    const OnSelectFile = (e) =>
    {
        setState({src:e.target.files[0]})
        console.log(e.target.files[0])
        
    }
    return(
       
            <div>
                <input
                    type="file"
                    accept={listOfExtension}
                    onChange={(e)=>OnSelectFile(e)}
                />
                {
                    state?.src != undefined ? <ShowFileUploaded src={state} projectID={props.projectID} id={props.id}/> : <div></div>
                }
            </div>
       
    )
}
export default FilesCard;
