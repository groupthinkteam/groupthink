import React , {useState} from 'react';
import { Rnd } from 'react-rnd';
import "../../styles/Document.scss"
import * as NodeOperation from './NodeOperation';
import { Card, Button } from 'react-bootstrap';
import InlineTextEdit, { InlineContentEdit } from '../../components/InlineTextEdit/InlineTextEdit';
import Xarrow from 'react-xarrows/lib';

const SubNodeReturn = (props) =>
    {
        //console.log("SubNOdes Props",props)
        const reparentNode = () => 
        {
            const path = 'documents/'+props.projectId+'/nodes/'+props.parent+'/subnodes/'
           props.sendPath(path,props.childDetail);
        }
        if(props.type == 'subnode')
        {
            return(
                <>
                    <Rnd
                    default =
                    {{
                        x : 0,
                        y : 117
                    }}
                    minHeight={320}
                    minWidth={220}
                    //onDrag={(e,d)=>{onStop(d.x,d.y)}}
                    //size={{ width: state.width,  height: state.height }}
                    //position={{ x: state.x, y: state.y }}
                    //onDragStop={(e, d) => { onStop(d.x,d.y) }}
                    //onResizeStop={(e, direction, ref, delta, position) => {onResizeNode(ref.style.width,ref.style.height)}}
                    id={`${props.key_id}`}
                    >
                    
                    <div className="child-card">     
                        
                        <Card border='dark'>
                            <Card.Title>
                                text:{props.childTitle}
                            </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    
                                        text :{props.content}
                                    
                                    
                                </Card.Text>
                                <Card.Text>Parent: {props.parent}</Card.Text>
                                <Card.Text>ID: {props.key_id}</Card.Text>
                                <Button variant="outline-danger" size="sm">Delete</Button>
                                <Button variant="outline-dark" size="sm">Add Child</Button>
                                <Button variant="outline-primary" size="sm" onClick={reparentNode}>Reparent</Button>
                            </Card.Body>
                        </Card>
                    </div>
                    </Rnd>
                    <Xarrow
                    strokeWidth='4'
                    //path="M5 40 l215 0"
                    start={`${props.parent}`}
                    end={`${props.key_id}`}
                    passProps={{onClick: ()=> {console.log("Arrow clicked End \n",`${props.key_id} And Start \n ${props.parent}`)}}}                                             
                    />
                </>
            )
        }
}
export default SubNodeReturn;
/**
 * <div id="useXarrow">
                    <Xarrow
                    strokeWidth='4'
                    //path="M5 40 l215 0"
                    start={`${props.parent}`}
                    end={`${props.key_id}`}                                             
                    />
                    </div>
 */