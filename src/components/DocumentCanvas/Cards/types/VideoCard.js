import React,{useState, useEffect} from 'react';
import ReactPlayer from 'react-player/lazy';
import { firbaseStorage } from '../../../../services/firebase';
import { auth } from 'firebase';
import Loading from '../../../Loading';
import { Button } from 'react-bootstrap';
const ShowFileUploaded = (props) =>{
    let [videoState , setVideoState] = useState();
    var file = props.src.src;
    let url = 0;
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "videos/" + file.name
    var metadata = {
        contentType: `${props.src.src.type}`
    };
    useEffect(()=>{
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
                    setVideoState({ url: url, metadata: data })
                })
                .catch((err) => console.log("Error in Metadata", err))
            )
            .catch((err) => console.log("Error in DownLoadURL", err))
        }
        );
    },[url])
    
    return( 
        <div style={{display:"grid"}}>
          {
               videoState?.url != undefined ?
               <ReactPlayer
                controls={true}
                url={videoState.url}
                />
               : <div>File is Uploading </div>
          }
        </div>
    )
 }
const VideosCard = (props) =>{
    const [state , setState]= useState()
    const [videoState, setVideo] = useState([])
    const [playerState , setPlayerState] = useState(false);
    //console.log(state)
    const listOfExtension= "video/*"
    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src:e.target.files[0]})//URL.createObjectURL(e.target.files[0])})
    }
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "videos/"
    useEffect(()=>{
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
                        setVideo(prev => ([
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
    },[])
    return(
       
            <div>
                <input
                    type="file"
                    accept={listOfExtension}
                    onChange={(e)=>OnSelectFile(e)}
                />
                {
                    (videoState != null || videoState != undefined) ?
                    <div>
                        Uploaded Files
                        {
                            videoState
                            .map((item)=>(
                                <div key={item.metadata.name}>
                                    File Name : {item.metadata.name}
                                    <ReactPlayer
                                        controls={true}
                                        url={item.url}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    :<div>Loading Data If Present</div>
                }
                {
                    state?.src != undefined ? <ShowFileUploaded src={state} projectID={props.projectID} id={props.id}/> : <div></div>
                }
            </div>
       
    )
}
export default VideosCard;
/**
 * <Button variant="outline-success" onClick={setPlayerState(true)}>Play</Button>
                                    {
                                        playerState ?
                                        <div>
                                        <Button variant="outline-danger" onClick={setPlayerState(false)}>Stop</Button>
                                        dd
                                        </div>
                                        : <div></div>
                                    }
 */