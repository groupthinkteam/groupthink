import React , {useState} from 'react';
import {Card,Form,Button} from "react-bootstrap";
import './DocumentCard.scss';
const DocumentCard = (props) => {
    
    let [state ,setState] = useState({});
    
    const propWritetoDB = (refURL,text) =>()=>{
        props.sendWriteToDB(refURL,text);
    }
    const propDeletetoDB = (refURL,title,id) =>()=>{
        props.sendDeleteToDB(refURL,title,id);
    }
    const propUpdatetoDB = (refURL,id,text) =>()=>{
        props.sendUpdateToDB(refURL,id,text);
    }
    if(props.type === 'parent')
    {
        return(
            <>
                <div className="project-card">
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
            </>
        )
    }
    else
    {
        return(
            <div className="project-card" >    
                <div className="project-card-title">
                    {props.childTitle}
                    <span>
                            <i className="fa fa-trash" aria-hidden="true" onClick={propDeletetoDB(props.nodePath,props.title,props.key_id)} style={{cursor:"pointer"}}></i>
                            
                        </span>
                
                  <b> Content : </b> {props.content}
                  
                    <Form onSubmit={propUpdatetoDB(props.nodePath,props.key_id ,{title:state.updated_text , content:state.updated_content} )} className="mt-2" >
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control className="mb-2" type="id" placeholder="Enter Project Name" onChange={event=>setState({updated_text:event.target.value ,updated_content:state.updated_content })}/>
                        <Form.Control className="mb-2" type="id" placeholder="Enter Your Content" onChange={event=>setState({updated_text:state.updated_text,updated_content:event.target.value})}/>
                        <Button variant="primary" type="submit" > 
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        )
        
    }
}
export default DocumentCard;