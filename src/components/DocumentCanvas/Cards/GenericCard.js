import React from "react";
import TextCard from "./types/TextCard";
import Button from "../../Button/Button";
import "../../../styles/Cards/GenericCard.scss";
import { Button as BootButton } from "react-bootstrap";
import Xarrow from 'react-xarrows/lib';

// props
// --------
// id:
// type:
// content: 
// cardAPI:
// --------

export default function GenericCard(props) {

    let onContentChange = (content) => props.cardAPI.change(props.id, content);
    let onSave = (content) => props.cardAPI.save(props.id, content);
    let addChild=() => props.cardAPI.addChild(props.id);
    let sendPath=() =>props.cardAPI.sendPath(props.id);
    let reparent=() => props.cardAPI.requestReparent(props.id)
    let flag=true
    if(props.cardDetail.parent === props.projectID)
    {flag=false}   
    return (
        <>
        <div className="card">
            <div className="card-handle card-title-bar">
                <Button handleClick={() => props.cardAPI.remove(props.id,props.cardDetail.parent,props.cardDetail.children)}>
                    X
                </Button>
            </div>
            <TextCard
                content={props.cardDetail.content}
                onContentChange={(text) => onContentChange(text)}
                onSave={(text) => onSave(text)}
            />
            Parent Id : {props.cardDetail.parent}
            Own Id : {props.id}
            <BootButton variant="outline-dark" size="sm" onClick={addChild}>Add Child</BootButton>
            <BootButton variant="outline-info" size="sm" onClick={sendPath}>Send Path</BootButton>
            <BootButton variant="outline-warning" size="sm" onClick={reparent}>Reparent</BootButton>
        </div>
        {
            flag ? 
            <Xarrow
                start={`${props.cardDetail.parent}`}
                end={`${props.id}`}
                lineColor="black"
                path="grid"
                label ={{start:"child"}}
                passProps={{onClick: ()=> {console.log("Arrow clicked Start \n",`${props.key_id} And End \n Parent`)}}}
            /> 
            :<div></div>
        }
        </>
    )
}
/**
 * <Xarrow
                start={`${props.cardDetail.parent}`}
                end={`${props.id}`}
                passProps={{onClick: ()=> {console.log("Arrow clicked Start \n",`${props.key_id} And End \n Parent`)}}}
            />
 */