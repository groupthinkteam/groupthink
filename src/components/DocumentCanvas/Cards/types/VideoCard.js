import React,{useState, useEffect} from 'react';
import ReactPlayer from 'react-player/lazy';
import { auth } from 'firebase';
import { StoreFileToStorage, GetFileFromStorage } from '../../../../services/storage';
const ShowFileUploaded = (props) =>{
    const [videoState , setVideoState] = useState();
    var file = props.src.src;
    let url = 0;
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "videos/" + file.name
    var metadata = {
        contentType: `${props.src.src.type}`
    };
    useEffect(()=>{
        StoreFileToStorage(refURL,file, metadata , data => {
            setVideoState(data)
        })
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
        GetFileFromStorage(refURL,data=>{
            setVideo(data)
        })
    },[])
    return(
       
            <div>
                <input
                    type="file"
                    accept={listOfExtension}
                    onChange={(e)=>OnSelectFile(e)}
                />
                {
                    (videoState != null || videoState != undefined) && videoState.length>0?
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
                    :<div/>
                }
                {
                    state?.src != undefined ? <ShowFileUploaded src={state} projectID={props.projectID} id={props.id}/> : <div></div>
                }
            </div>
       
    )
}
export default VideosCard;
