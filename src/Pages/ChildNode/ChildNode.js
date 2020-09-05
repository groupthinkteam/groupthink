import React , {useState, useRef} from 'react';
import { Rnd } from 'react-rnd';
import "../../styles/Document.scss"
import * as NodeOperation from './NodeOperation';
import { Card, Button } from 'react-bootstrap';
import InlineTextEdit, { InlineContentEdit } from '../../components/InlineTextEdit/InlineTextEdit';
import { writeToDB } from '../Document/crudOpr';
import SubNodeReturn from './SubNodes';
import Xarrow from 'react-xarrows/lib';

const ChildNode = (props) =>
{
    const box1Ref = useRef(props.key_id);

    const nodeId = props.key_id;
    const propjectId = props.projectID;
    //console.log("Child Node",propjectId,nodeId)
    let [state ,setState] = useState(
        {
            width:'220px',
            height:'320px',
            x:10,
            y:10
          }
    );
    
    const onStop = (d_x,d_y) =>
    {
      setState({ x:  d_x  , y: d_y, width: state.width,  height: state.height })
      var heightInPX = state.height.match(/\d+/g);
      var widthInPX = state.width.match(/\d+/g);
      props.coordinate({
        x:d_x,
        y:d_y ,
        height:  parseInt(heightInPX[0]) ,
        width : parseInt(widthInPX[0]),
        old_y:state.y , 
        old_x:state.x
      });
      onMoveNode(d_x,d_y);
      
    }
    const onMoveNode = (x,y) =>
    {
        const newPos = {x:x ,y:y , width:state.width , height:state.height};
        NodeOperation.onMove(propjectId,nodeId,newPos);
    }
    const onResizeNode = (width , height ) =>
    {
        setState({
            width: width,
            height: height,
            x: state.x, y: state.y
        });
        const newSize = {width:width,height:height};
        NodeOperation.onResize(propjectId,nodeId,newSize);
    }
    const onDeleteNode = ()  =>{
        NodeOperation.onDelete(propjectId,nodeId,props.parent,props.childDetail[1]?.children);
    }
    const addChildNode = ()  => 
    {
        const path = 'documents/'+propjectId+'/nodes/'+nodeId+'/subnodes/';
        writeToDB(path,propjectId,nodeId);
    }
    const sendPath = () =>
    {
        props.sendPath(props.key_id)
    }
    const reparentNode = () => 
    {
        //const path = 'documents/'+props.projectId+'/nodes/'+props.parent+'/subnodes/'
        props.reparentPath(props.key_id);
    }
    return(
        <>
            <Rnd
            default =
            {{
                x : 110,
                y : 347
            }}
            minHeight={320}
            minWidth={220}
            //onDrag={(e,d)=>{onStop(d.x,d.y)}}
            onResize={(e, direction, ref, delta, position) => {
            setState({
                width: ref.style.width,
                height: ref.style.height,
                x: state.x, y: state.y,
                ...position
            });
            }}
            size={{ width: state.width,  height: state.height }}
            //position={{ x: state.x, y: state.y }}
            onDragStop={(e, d) => { onStop(d.x,d.y) }}
            onResizeStop={(e, direction, ref, delta, position) => {onResizeNode(ref.style.width,ref.style.height)}}
            //ref={box1Ref}
            id={`${props.key_id}`}
            >
               
            <div className="child-card"  style={{width:state.width,height:state.height , left:`${state.x}px` , top:`${state.y}px` , transform : ` translate(-10px,-10px)`}}>    
                
                <Card border='dark' style={{width:state.width,height:state.height}}>
                    <Card.Title>
                        <InlineTextEdit
                            className="project-card-item"
                            text={props.childTitle}
                            onSave={(text) => props.onRename(props.key_id, text , 'title')}
                        />
                    </Card.Title>
                    <Card.Body>
                        <Card.Text>
                            <InlineContentEdit
                                className="project-card-item"
                                text={props.content}
                                onSave={(text) => props.onRename(props.key_id, text , 'content')}
                            />
                            
                        </Card.Text>
                        <Card.Text>Parent: {props.parent}</Card.Text>
                        <Card.Text>ID: {props.key_id}</Card.Text>
                        <Button variant="outline-danger" size="sm" onClick={onDeleteNode}>Delete</Button>
                        <Button variant="outline-dark" size="sm" onClick={addChildNode}>Add Child</Button>
                        <Button varaint="outline-primary" size="sm" onClick={sendPath}>Send Path</Button>
                        <Button varaint="outline-success" size="sm" onClick={reparentNode}>Reparent</Button>
                    </Card.Body>
                </Card>
            </div>
            </Rnd>
            <Xarrow
                start={`${props.parent}`}
                end={`${props.key_id}`}
                passProps={{onClick: ()=> {console.log("Arrow clicked Start \n",`${props.key_id} And End \n Parent`)}}}
                />
        </>
    )
}
export default ChildNode;
/**
 * 
 * <div className="project-card-title">
                    Title : {props.childTitle}
                    <span>
                            <i className="fa fa-trash" aria-hidden="true"  style={{cursor:"pointer"}}></i>
                            
                        </span>
                
                  <b> Content : </b> {props.content}
                  
                  
                </div>
 */