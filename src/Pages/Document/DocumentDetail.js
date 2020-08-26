import React , {useState} from 'react';
import {Card} from "react-bootstrap";
import { Rnd } from 'react-rnd';
import "../../styles/Document.scss"
const DocumentCard = (props) => {
    
    let [state ,setState] = useState(
        {
            width:'220px',
            height:'320px',
            x:10,
            y:10,
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
      })
      
    }
    if(props.type === 'parent')
    {
        return(
            <>
            <Rnd
             style={{backgroundColor:"blue" , borderBlockColor:"red"}}
            onDrag={(e,d)=>{onStop(d.x,d.y)}}
            onResize={(e, direction, ref, delta, position) => {
            setState({
                width: ref.style.width,
                height: ref.style.height,
                x: state.x, y: state.y,
                ...position
            });
            }}
            minHeight={320}
            minWidth={220}
            size={{ width: state.width,  height: state.height }}
            position={{ x: state.x, y: state.y }}
            onDragStop={(e, d) => { onStop(d.x,d.y) }}
            onResizeStop={(e, direction, ref, delta, position) => {
            setState({
                width: ref.style.width,
                height: ref.style.height,
                x: state.x, y: state.y,
                ...position
            });
            }}
            >
                <Card 
                    style={{
                        position:'absolute', 
                        width:state.width,
                        height:state.height,
                      //  left:`${state.x}px`,
                       // top:`${state.y}px` ,
                       // transform : ` translate(-10px,-10px)`,
                        boxShadow : `grey 12px 12px 4px`,
                    }}>
                    <Card.Img src={props.thumbnailURL}/>
                    <Card.Body>
                        <Card.Title>{props.projecTitle}</Card.Title>
                        <footer className="blockquote-footer">Created On {props.date}</footer>    
                    </Card.Body> 
                </Card>
                </Rnd>
            </>
        )
    }
    else
    {
        return(
            <Rnd
            default =
            {{
                x : 110,
                y : 347
            }}
            minHeight={320}
            minWidth={220}
            // style={{backgroundColor:"blue" , borderBlockColor:"red"}}
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
            onResizeStop={(e, direction, ref, delta, position) => {
            setState({
                width: ref.style.width,
                height: ref.style.height,
                x: state.x, y: state.y,
                ...position
            });
            }}
            >
               
            <div className="child-card"  style={{width:state.width,height:state.height , left:`${state.x}px` , top:`${state.y}px` , transform : ` translate(-10px,-10px)`}}>    
                <div className="project-card-title">
                    Title : {props.childTitle}
                    <span>
                            <i className="fa fa-trash" aria-hidden="true"  style={{cursor:"pointer"}}></i>
                            
                        </span>
                
                  <b> Content : </b> {props.content}
                  
                  
                </div>
                
            </div>
            </Rnd>
        )
        
    }
}
export default DocumentCard;
/**
 * size={{ width: state.width,  height: state.height }}
            //position={{ x: state.x, y: state.y }}
            onResize = {(e,d,ref,delta,pose)=>{
                setState({
                    width: ref.style.width,
                    height: ref.style.height,
                    x: state.x, y: state.y,
                    ...pose,
                    });
            }}
            onDragStop={(e, d) => { setState({ x: d.x, y: d.y , width: state.width,  height: state.height }) }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setState({
                width: ref.style.width,
                height: ref.style.height,
                x: state.x, y: state.y,
                ...position,
                });
            }}
 * <div className="project-card">
                    <div className="project-card-title">
                        {props.projectTitle}
                        
                        <Form onSubmit={propWritetoDB(props.nodePath ,{title:state.text , content:state.content} )} className="mt-2" >
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control className="mb-2" type="id" placeholder="Enter Project Name" onChange={(event)=>setState({text:event.target.value,content:state.content})}/>
                            <Form.Control className="mb-2" type="id" placeholder="Enter Your Content" onChange={(event)=>setState({text:state.text,content:event.target.value})}/>
                            <Button variant="primary" type="submit" className="mt-3"> 
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
  *    var element = document.getElementById('project-card');
    var position = element.getBoundingClientRect();
    var rnd = document.getElementsByClassName("rnd");
    var rnd_pos = rnd.getBoundingClientRect();
    console.log(element.getBoundingClientRect)
    //var x = position.left;
    //var y = position.top;
    //setState({x:position.left , y: position.top , })
    console.log("Project Card Co-ordinates",position.left,position.right);
    console.log("Rnd Co-ordinates",rnd_pos.left,rnd_pos.right);
 */