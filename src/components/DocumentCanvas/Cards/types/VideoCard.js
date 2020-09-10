import React,{useState} from 'react';
const ShowFileUploaded = (props) =>{
   
    return(
      <div>
        Video is Uploaded
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
        if(e.target.files && e.target.files.length > 0)
        {
            const reader = new FileReader();
            reader.addEventListener("load",()=>{
                setState({src:reader.result  })
            })
            reader.readAsDataURL(e.target.files[0])
            console.log("Reader Log \n",state?.src)
        }
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
