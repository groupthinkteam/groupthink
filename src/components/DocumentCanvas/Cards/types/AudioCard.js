import React,{useState} from 'react';
import ReactAudioPlayer from 'react-audio-player';
const ShowFileUploaded = (props) =>{
    
    return(
      <div>
        Audio is Uploaded
        <ReactAudioPlayer
            src={props.src.src}
            autoPlay={true}
            controls={true}
        />
      </div>
    )
 }
const AudiosCard = () =>{
    const [state , setState]= useState()
    //console.log(state)
    const listOfExtension= "audio/* , .mp3"
    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src:e.target.files[0].name})
       /* if(e.target.files && e.target.files.length > 0)
        {
            const reader = new FileReader();
            reader.addEventListener("load",()=>{
                setState({src:reader.result , name:e.target.files[0] })
            })
            reader.readAsDataURL(e.target.files[0])
            console.log("Reader Log \n",state?.src)
        }*/
    }
    return(
       
            <div>
                <input
                    type="file"
                    accept={listOfExtension}
                    onChange={(e)=>OnSelectFile(e)}
                />
                {
                    state?.src != undefined ? <ShowFileUploaded src={state}/> : <div></div>
                }
            </div>
       
    )
}
export default AudiosCard;