import React,{useState,useEffect} from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { auth } from 'firebase';
import { GetFileFromStorage , StoreFileToStorage} from '../../../../services/storage';
const ShowFileUploaded = (props) =>{
    const [audioState , setAudioState] = useState();
    var file = props.src.src;
    let url = 0;
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "audios/" + file.name
    var metadata = {
        contentType: `${props.src.src.type}`
    };
    useEffect(()=>{
        StoreFileToStorage(refURL,file,metadata,data=>{
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
                    style={{width:`${props.width}`}}
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
    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src:e.target.files[0]})
    }
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "audios/"
    useEffect(()=>{
        GetFileFromStorage(refURL ,data =>{
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
                    (audioState != null || audioState != undefined) ?
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
                                        style={{width:`${props.width}`}}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    :<div>Loading Data If Present</div>
                }
                {
                    state?.src != undefined ? <ShowFileUploaded src={state} width={props.CardDetail?.size.width}  projectID={props.projectID} id={props.id}/> : <div></div>
                }
            </div>
       
    )
}
export default AudiosCard;
