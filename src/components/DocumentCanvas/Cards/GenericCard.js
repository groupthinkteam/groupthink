import React, { useEffect, useState } from "react";
import TextCard from "./types/TextCard";
import Xarrow from 'react-xarrows/lib';
import YoutubeCard from "./types/YoutubeCard";
import PDFCard from "./types/PDFCard";
import ImagesCard from "./types/ImagesCard";
import FilesCard from "./types/FilesCard";
import VideosCard from "./types/VideoCard";
import AudiosCard from "./types/AudioCard";
import LinkCard from "./types/LinkCard";
import { useDrop } from 'react-dnd';
import { useDrag } from 'react-dnd';


import "../../../styles/Cards/GenericCard.scss";
import DeleteCard from "./DeleteCard";
import { Button } from "react-bootstrap";
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
//-----Drop BOX-----
const DropBoxCard = (props) =>
{
    const style = {
        height: "50px",
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
        drop: () => ({ name: props.id }),
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
const DisplayTextCard = (props)=>
{
    const onContentChange = (content) => props.cardAPI.change(props.id, content);
    const onSave = (content) => {
        props.cardAPI.save(props.id, content);
    }
    return(
        <TextCard
                content={props.cardDetail.content}
                onContentChange={(text) => onContentChange(text)}
                onSave={(text) => onSave(text)}
            />
    )
}
//------Drag Box-----
export default function GenericCard(props) {
    const [showOptionsForReparent , setOptionsForReparent] = useState(true);
    const CardDetail = props.cardDetail;
    const CardId = props.id;
    const addChild=() => props.cardAPI.addChild(CardId);
    const sendPath=(id,operation) =>props.cardAPI.sendPath(id,operation);
    const deleteCard=(operation)=> props.cardAPI.remove(CardId,operation)
    const showRadioForReparent = () => {
        setOptionsForReparent(false);
        reparent(CardId);
    }
    const closeDelete = () =>
    {
        sendPath(CardId,true);
    }
    const reparent=(id) =>{ 
        props.cardAPI.requestReparent(id)
    }
    const uploadFile = (file , metadata,callback) =>{ 
        props.cardAPI.storeFile(CardId,file,metadata,data=>{
            callback(data);
        })
    }
    const fetchFile = (callback) => {
        props.cardAPI.displayFile(CardId,data=>{callback(data)})
    }
    const [{ isDragging }, drag] = useDrag({
        item: { CardId, type: ItemTypes.BOX ,detail:CardDetail },
        begin :(monitor)=>{
            reparent(CardId)
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
    //console.log(showOptionsForReparent , CardDetail.children)
    return (
        <>
        <div className="card custom_card border-0" >
            <div className="card-handle card-title-bar">
                <DeleteCard 
                    className="absolute delete_btn wh-20p rounded-circle" 
                    deleteCard={deleteCard.bind(this)}
                    CardDetail={CardDetail}
                    id={CardId}
                    reparent={reparent.bind(this)}
                    showOption={showRadioForReparent.bind(this)}
                />
                {
                    showOptionsForReparent && !flag?
                    <button className="absolute wh-20p rounded-circle" onClick={closeDelete}>
                        <i class="fa fa-check" aria-hidden="true"></i>
                    </button>
                    :<div/>
                }
                
                <button className="absolute lock_btn wh-20p rounded-circle">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                </button>
                <button className="absolute add_btn wh-20p" onClick={addChild}>
                    <span className="rounded-circle">+</span>
                </button>
            </div>
            <div ref={drag} style={{opacity}}>
            {
                CardDetail.type === 'blank' ?
                <DisplayTextCard id={props.id} cardAPI={props.cardAPI} cardDetail={CardDetail}/>
                :<div/>
            }
            {
                CardDetail.type === 'youtube' ? 
                <YoutubeCard CardDetail={CardDetail}>
                    <DisplayTextCard id={props.id} cardAPI={props.cardAPI} cardDetail={CardDetail}/>
                </YoutubeCard> : <div></div>
            }
            {
                CardDetail.type === 'link' ? 
                <LinkCard CardDetail={CardDetail}>
                    <DisplayTextCard id={props.id} cardAPI={props.cardAPI} cardDetail={CardDetail}/>
                </LinkCard> : <div></div>
            }
            
            
            {
                CardDetail.type === 'PDF' ? <PDFCard fetchFile={fetchFile.bind(this)} uploadFile={uploadFile.bind(this)} CardDetail={CardDetail} /> : <div></div>
            }
            {
                CardDetail.type === 'image' ? <ImagesCard fetchFile={fetchFile.bind(this)} uploadFile={uploadFile.bind(this)} /> : <div></div>
            }
            {
                CardDetail.type === 'files' ? <FilesCard fetchFile={fetchFile.bind(this)} uploadFile={uploadFile.bind(this)}/> : <div></div>
            }
            {
                CardDetail.type === 'videos' ? <VideosCard fetchFile={fetchFile.bind(this)} uploadFile={uploadFile.bind(this)}/> : <div></div>
            }
            {
                CardDetail.type === 'audios' ? <AudiosCard CardDetail={CardDetail} fetchFile={fetchFile.bind(this)} uploadFile={uploadFile.bind(this)} /> : <div></div>
            }
            
            </div>
            <div style={{ overflow: 'hidden', clear: 'both' ,marginTop:"16px" }}>
                <DropBoxCard CardDetail={CardDetail}  id={props.id}/>
            </div>
        </div>
        
        {
            flag ? 
            <Xarrow
                start={`${CardDetail.parent}`}
                end={`${CardId}`}
                lineColor="black"
                path="grid"
                label ={{start:"parent",end:"child"}}
                monitorDOMchanges={true}
                //passProps={{onDrag:(e)=>{console.log("Dragged",e)},onClick: (e)=> {console.log("Arrow clicked Start \n",`${props.id} And End \n Parent \n`,`${props.cardDetail.parent}`,e)}}}
                advanced = {{
                    passProps : { 
                        arrowBody : {
                            onDragStart : () =>{console.log("Drag Start")},
                            onClick : () => {console.log("Arrow Body Clicked!")}
                        }, 
                        arrowHead : {
                            onClick : () => {
                                console.log("Head Clicked")
                            }
                        } 
                    }
                }}
            /> 
            :<div></div>
        }
        </>
    )
}

