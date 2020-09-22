import React,{useState, useEffect} from 'react';
import ReactPlayer from 'react-player/lazy';
const ShowFileUploaded = (props) =>{
    const [videoState , setVideoState] = useState();
    var file = props.src.src;
    var metadata = {
        contentType: `${props.src.src.type}`
    };
    useEffect(()=>{
        props.uploadFile(file, metadata , data => {
            setVideoState(data)
        })
    },[])
    
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
    const listOfExtension= "video/*"
    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src:e.target.files[0]})//URL.createObjectURL(e.target.files[0])})
    }
    useEffect(()=>{
        props.fetchFile(data=>{
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
                    state?.src != undefined ? <ShowFileUploaded uploadFile={props.uploadFile.bind(this)} src={state} /> : <div></div>
                }
            </div>
       
    )
}
export default VideosCard;
