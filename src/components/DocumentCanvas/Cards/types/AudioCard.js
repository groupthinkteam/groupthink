import React,{useState,useEffect} from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { auth } from 'firebase';

const AudiosCard = (props) =>{
    
    console.log("PROPS",props.id,props.content)
    const listOfExtension= "audio/* "
    const requestUpload =  (e) =>
    {
        const file = e.target.files[0];
        var metadata = {
            contentType: file.type
        };
        props.typeAPI.requestUpload(props.id,file,metadata,(data) =>{
            props.typeAPI.saveContent(props.id,{uploadStatus : data})
        })
    }
    const requestDownload = () =>
    {
        props.typeAPI.requestDownload(props.id , (url,metadata) =>{
            props.typeAPI.saveContent(props.id,{url:url || 'blank' , metadata:metadata || 'blank'})
        })
    }
    const content = props.content;
    return(
       
            <div>
                
                <input
                    type="file"
                    accept={listOfExtension}
                    onChange={(e)=> requestUpload(e)}
                />
                {
                    // content != undefined || content?.metadata != 'blank' ?
                    // <div key={content.metadata.name}>
                    //     File Name : {content.metadata.name}
                    //     <ReactAudioPlayer
                    //         src={content.url}
                    //         autoPlay={false}
                    //         controls={true}   
                    //     />
                    // </div>
                    // :<div/>    
                }
                                                
                <requestDownload/>
            </div>
       
    )
}
export default AudiosCard;
/**
 *  {
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
 */
