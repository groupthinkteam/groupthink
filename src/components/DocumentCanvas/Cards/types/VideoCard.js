import React,{useState} from 'react';
import ReactPlayer from 'react-player/lazy';
const ShowFileUploaded = (props) =>{
   
    return(
      <div>
       <ReactPlayer
       controls={true}
       url={props.src.src}
       />
      </div>
    )
 }
const VideosCard = () =>{
    const [state , setState]= useState()
    //console.log(state)
    const listOfExtension= "video/*"
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
                    state?.src != undefined ? <ShowFileUploaded src={state}/> : <div></div>
                }
            </div>
       
    )
}
export default VideosCard;
