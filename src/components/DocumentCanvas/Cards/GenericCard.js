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
import LinkCard from "./types/LinkCard";
import { Rnd } from "react-rnd";
import { useDrop } from 'react-dnd';
import { useDrag } from 'react-dnd';

// props
// --------
// id:
// type:
// content: 
// cardAPI:
// parent:
// Types Of Card
// --------

//--------Common Type Box----
const ItemTypes = {
    BOX: 'box',
  } 
const DropBoxCard = (props) =>
{
    const style = {
        height: "80px",
        width: props.CardDetail.size.width,
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '1rem',
        lineHeight: 'normal',
        float: 'left',
      }
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemTypes.BOX,
        drop: () => ({ name: props.id ,details:props.CardDetail}),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) 
    {
      backgroundColor = 'darkgreen'
      
    }else if (canDrop) {
      backgroundColor = 'darkkhaki'
    }
    return(
        <div ref={drop} style={{ ...style, backgroundColor }}>
            {isActive ? 'Release to drop' : 'Drop To Reparent'}
        </div>
    )
}
export default function GenericCard(props) {
    const CardDetail = props.cardDetail;
    const CardId = props.id;
    const onContentChange = (content) => props.cardAPI.change(props.id, content);
    const onSave = (content) => {
        props.cardAPI.save(props.id, content);
    }
    const addChild=() => props.cardAPI.addChild(props.id,CardDetail.type);
    const sendPath=(id) =>props.cardAPI.sendPath(id);
    const reparent=(id,detail) =>{ 
        props.cardAPI.requestReparent(id,detail)
    }
    const [{ isDragging }, drag] = useDrag({
        item: { CardId, type: ItemTypes.BOX ,detail:CardDetail },
        begin :(monitor)=>{
            reparent(props.id,CardDetail)
        },
        end: (item, monitor) => {
          const dropResult = monitor.getDropResult()
          if (item && dropResult) {
            sendPath(dropResult.name)
            //console.log("Droped",item.CardId,"\n In \n",dropResult.name, dropResult.details)
          }
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0.4 : 1
    let flag=true
    if(props.cardDetail.parent === props.projectID)
    {flag=false}

    return (
        <>
        <div className="card" >
            <div className="card-handle card-title-bar">
                <Button handleClick={() => props.cardAPI.remove(props.id,CardDetail.parent,CardDetail.children,CardDetail.type)}>
                    X
                </Button>
            </div>
            <div ref={drag} style={{opacity}}>
            <TextCard
                content={props.cardDetail.content}
                onContentChange={(text) => onContentChange(text)}
                onSave={(text) => onSave(text)}
            />
            <BootButton variant="outline-dark" size="sm" onClick={addChild}>Add Child</BootButton>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
                <DropBoxCard CardDetail={CardDetail} reqReparent={reparent.bind(this)} id={props.id}/>
            </div>
            {
                CardDetail.type === 'youtube' ? <YoutubeCard CardDetail={CardDetail}/> : <div></div>
            }
            {
                CardDetail.type === 'PDF' ? <PDFCard projectID={props.projectID} id={props.id}/> : <div></div>
            }
            {
                CardDetail.type === 'image' ? <ImagesCard  projectID={props.projectID} id={props.id}/> : <div></div>
            }
            {
                CardDetail.type === 'files' ? <FilesCard projectID={props.projectID} id={props.id} /> : <div></div>
            }
            {
                CardDetail.type === 'videos' ? <VideosCard projectID={props.projectID} id={props.id}/> : <div></div>
            }
            {
                CardDetail.type === 'audios' ? <AudiosCard CardDetail={CardDetail} projectID={props.projectID} id={props.id}/> : <div></div>
            }
            {
                CardDetail.type === 'link' ? <LinkCard CardDetail={CardDetail} /> : <div></div>
            }
            </div>
        </div>
        <Rnd
        style={{backgroundColor:'green'}}
        >
        {
            flag ? 
            <Xarrow
                start={`${props.cardDetail.parent}`}
                end={`${props.id}`}
                lineColor="black"
                path="grid"
                label ={{start:"parent",end:"child"}}
                passProps={{onClick: ()=> {console.log("Arrow clicked Start \n",`${props.id} And End \n Parent \n`,`${props.cardDetail.parent}`)}}}
            /> 
            :<div></div>
        }
        </Rnd>
        
        </>
    )
}
/**
 * <BootButton variant="outline-info" size="sm" onClick={sendPath(props.id)}>Send Path</BootButton>
            <BootButton variant="outline-warning" size="sm" onClick={reparent(props.id)}>Reparent</BootButton>
            
 */
