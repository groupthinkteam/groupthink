import React,{useState} from 'react';
import ReactAudioPlayer from 'react-audio-player';
const ShowFileUploaded = (props) =>{
    
    return(
      <div>
        Audio is Uploaded
        <ReactAudioPlayer
            src={props.src.src}
            autoPlay={false}
            controls={true}
            style={{width:`${props.width}`}}
        />
        
      </div>
    )
 }
const AudiosCard = (props) =>{
    const [state , setState]= useState()
    //console.log(state)
    const listOfExtension= "audio/* "
    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src:URL.createObjectURL(e.target.files[0])})
    }
    return(
       
            <div>
                <input
                    type="file"
                    accept={listOfExtension}
                    onChange={(e)=>OnSelectFile(e)}
                />
                {
                    state?.src != undefined ? <ShowFileUploaded src={state} width={props.CardDetail?.size.width}/> : <div></div>
                }
            </div>
       
    )
}
export default AudiosCard;