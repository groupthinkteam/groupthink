import React, { useState } from 'react';
import {Form,Button} from "react-bootstrap"
import './ProjectCard.scss';
import { Link } from 'react-router-dom';


const ProjectCard = (props) => {
    //console.log("Getting Path in ProjectCard",props.path)
    let [state ,setState] = useState({
        text : '',
        updated_text : ''
    })
    const propWritetoDB = (refURL,text) =>()=>{
        console.log('Send back data to Write',refURL,text);
        props.sendWriteToDB(refURL,text);

    }
    const propDeletetoDB = (refURL,title,id) =>()=>{
        console.log('Send back data to Delete',refURL,title);
        props.sendDeleteToDB(refURL,title,id);
    }
    const propUpdatetoDB = (refURL,id,text) =>()=>{
        console.log('Send back data to Update',refURL,text);
        props.sendUpdateToDB(refURL,id,text);
    }
    
    if (props.type === "add") {
        return (
            <>
            <div className="project-card">
                <div className="project-card-title">
                    
                    <Form  onSubmit={propWritetoDB(props.path,state.text)} className="mt-2" >
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control className="mb-2" type="id" placeholder="Enter Project Name" onChange={event=>setState({text:event.target.value})}/>
                        <Button variant="primary" type="submit" className="mt-3"> 
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
            
            </>
        )
    }
    else {
        return (
        <>
            
                <div className="project-card" >    
                    <div className="project-card-title">
                        <Link
                            to = {{
                                pathname : `/document/${props.key_id}`,
                                state :
                                {
                                    projectTitle : props.title,
                                    projectID : props.key_id,
                                    projectPath : props.path
                                }
                            }}
                        >
                            {props.title}
                        </Link>
                        <span>
                            <i className="fa fa-trash" aria-hidden="true" onClick={propDeletetoDB(props.path,props.title,props.key_id)} style={{cursor:"pointer"}}></i>
                            
                        </span>
                        
                        <div >
                        <Form onSubmit={propUpdatetoDB(props.path,props.key_id,state.updated_text)} className="mt-2">
                            <Form.Label>Update Project Name</Form.Label>
                            <Form.Control className="mb-2" type="id" placeholder="Enter Project Name" onChange={event =>  setState({updated_text:event.target.value})}/>
                            <Button variant="primary" type="submit" className="mt-3"> 
                                Submit
                            </Button>
                        </Form>
                        </div>
                    </div>
                </div>
            
        </>
        )
    }
}
export default ProjectCard;
/**
 * <NavLink
                          to={{
                            pathname:'/main',
                            projectDetail : {
                                projectTitle : props.title,
                                projectID : key_id,
                                projectPath : props.path
                            }
                           }}
                        >
                        {props.title}
                        </NavLink>
 */