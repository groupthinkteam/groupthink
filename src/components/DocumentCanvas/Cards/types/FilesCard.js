import React,{useState} from 'react';
const ShowFileUploaded = (props) =>{
   
    return(
      <div>
         File is Uploaded
      </div>
    )
 }
const FilesCard = () =>{
    const [state , setState]= useState()
    //console.log(state)
    const listOfExtension= ".odt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
export default FilesCard;
