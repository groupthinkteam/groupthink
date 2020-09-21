import React from "react";
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
    const CardDetail = props.cardDetail;
    const CardId = props.id;
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
        <div className="card custom_card border-0" >
            <div className="card-handle card-title-bar">
                <button className="absolute delete_btn wh-20p rounded-circle" onClick={() => props.cardAPI.remove(props.id,CardDetail.parent,CardDetail.children,CardDetail.type)}>
                    X
                </button>
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
                CardDetail.type === 'PDF' ? <PDFCard projectID={props.projectID} id={props.id} CardDetail={CardDetail} cardAPI={props.cardAPI}/> : <div></div>
            }
            {
                CardDetail.type === 'image' ? <ImagesCard  projectID={props.projectID} id={props.id} cardAPI={props.cardAPI}/> : <div></div>
            }
            {
                CardDetail.type === 'files' ? <FilesCard projectID={props.projectID} id={props.id} cardAPI={props.cardAPI}/> : <div></div>
            }
            {
                CardDetail.type === 'videos' ? <VideosCard projectID={props.projectID} id={props.id} cardAPI={props.cardAPI}/> : <div></div>
            }
            {
                CardDetail.type === 'audios' ? <AudiosCard CardDetail={CardDetail} projectID={props.projectID} id={props.id} cardAPI={props.cardAPI}/> : <div></div>
            }
            
            </div>
            <div style={{ overflow: 'hidden', clear: 'both' ,marginTop:"16px" }}>
                <DropBoxCard CardDetail={CardDetail}  id={props.id}/>
            </div>
        </div>
        
        {
            flag ? 
            <Xarrow
                start={`${props.cardDetail.parent}`}
                end={`${props.id}`}
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
/**
 * <div>
                                <svg>
                                <defs>
                                    <marker id="markerArrow1" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
                                    <path d="M2,2 L2,11 L10,6 L2,2" />
                                    </marker>
                                </defs>
                                <line x1="10" y1="10" x2="100" y2="100" style={{stroke:"#006600", markerEnd: "url(#markerArrow1)" }}/>
                                </svg>
                            </div>
 * <BootButton variant="outline-info" size="sm" onClick={sendPath(props.id)}>Send Path</BootButton>
            <BootButton variant="outline-warning" size="sm" onClick={reparent(props.id)}>Reparent</BootButton>
            
 */
