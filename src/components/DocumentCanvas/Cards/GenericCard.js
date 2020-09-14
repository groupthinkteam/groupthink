import React, { useState } from "react";
import TextCard from "./types/TextCard";
import Button from "../../Button/Button";
import "../../../styles/Cards/GenericCard.scss";
import { Button as BootButton } from "react-bootstrap";
import Xarrow from 'react-xarrows/lib';
import YoutubeCard from "./types/YoutubeCard";
import PDFCard from "./types/PDFCard";
import ImagesCard from "./types/ImagesCard";
import FilesCard from "./types/FilesCard";
import VideosCard from "./types/VideoCard";
import AudiosCard from "./types/AudioCard";

// props
// --------
// id:
// type:
// content: 
// cardAPI:
// parent:
// Types Of Card
// --------

export default function GenericCard(props) {
    const CardDetail = props.cardDetail;
    const onContentChange = (content) => props.cardAPI.change(props.id, content);
    const onSave = (content) => {
        props.cardAPI.save(props.id, content);
    }
    const addChild=() => props.cardAPI.addChild(props.id,CardDetail.type);
    const sendPath=() =>props.cardAPI.sendPath(props.id);
    const reparent=() =>{ 
        props.cardAPI.requestReparent(props.id,CardDetail)
    }
    let flag=true
    if(props.cardDetail.parent === props.projectID)
    {flag=false}

    return (
        <>
        <div className="card">
            <div className="card-handle card-title-bar">
                <Button handleClick={() => props.cardAPI.remove(props.id,CardDetail.parent,CardDetail.children,CardDetail.type)}>
                    X
                </Button>
            </div>
            <TextCard
                content={props.cardDetail.content}
                onContentChange={(text) => onContentChange(text)}
                onSave={(text) => onSave(text)}
            />
            <BootButton variant="outline-dark" size="sm" onClick={addChild}>Add Child</BootButton>
            <BootButton variant="outline-info" size="sm" onClick={sendPath}>Send Path</BootButton>
            <BootButton variant="outline-warning" size="sm" onClick={reparent}>Reparent</BootButton>
            {
                CardDetail.type === 'link' ? <YoutubeCard CardDetail={CardDetail}/> : <div></div>
            }
            {
                CardDetail.type === 'PDF' ? <PDFCard/> : <div></div>
            }
            {
                CardDetail.type === 'image' ? <ImagesCard/> : <div></div>
            }
            {
                CardDetail.type === 'files' ? <FilesCard projectID={props.projectID} id={props.id} /> : <div></div>
            }
            {
                CardDetail.type === 'videos' ? <VideosCard projectID={props.projectID} id={props.id}/> : <div></div>
            }
            {
                CardDetail.type === 'audios' ? <AudiosCard CardDetail={CardDetail}/> : <div></div>
            }
        </div>
        {
            flag ? 
            <Xarrow
                start={`${props.cardDetail.parent}`}
                end={`${props.id}`}
                lineColor="black"
                path="grid"
                label ={{start:"parent",end:"child"}}
                passProps={{onClick: ()=> {console.log("Arrow clicked Start \n",`${props.key_id} And End \n Parent`)}}}
            /> 
            :<div></div>
        }
        </>
    )
}
