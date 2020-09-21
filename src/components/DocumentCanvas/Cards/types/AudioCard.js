import React,{useState,useEffect} from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { auth } from 'firebase';
const ShowFileUploaded = (props) =>{
    const [audioState , setAudioState] = useState();
    const cardAPI = props.cardAPI;
    var file = props.src.src;
    let url = 0;
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "audios/" + file.name
    var metadata = {
        contentType: `${props.src.src.type}`
    };
    useEffect(()=>{
        cardAPI.storeFile(refURL,file,metadata,data=>{
            setAudioState(data)
        })
    },[url])
    return(
      <div>
        Audio is Uploaded
        {
            audioState != undefined ?
            <div>
                <ReactAudioPlayer
                    src={audioState.url}
                    autoPlay={false}
                    controls={true}
                    style={{width:`${props.width}px`}}
                />
            </div>
            :<div>Audio Uploading</div>
        }       
      </div>
    )
 }
const AudiosCard = (props) =>{
    const [state , setState]= useState()
    //console.log(state)
    const [audioState , setAudioState] = useState([]);
    const listOfExtension= "audio/* "
    const cardAPI = props.cardAPI;

    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src:e.target.files[0]})
    }
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "audios/"
    useEffect(()=>{
        cardAPI.displayFile(refURL ,data =>{
            setAudioState(data)
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
            </div>
       
    )
}
export default AudiosCard;
