import React,{useState}from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import "./ProjectCard.scss"
import * as Crud from "../../../CRUDopr"
import {Form,Button} from "react-bootstrap"
import { NavLink } from "react-router-dom"
export default function ProjectCard(props) {
    
    const refURL = 'users/' + firebase.auth().currentUser.uid +'/' ;
    let [state,setState] = useState({
        path: '',
        text : '',
        updated_text : '',
        flag : false
    })
    //console.log("Path",state.path)
    let key_id = props.key_id;
    const setWriteToDB = () => {
        console.log("PATH Project", state.path)
        Crud.writeToDB(refURL  , state.text , false);
    }  
    const setDeleteFromDB = () =>{
        Crud.deleteFromDB(props.path,props.title,key_id)
    } 
    const setUpdateTheDB = () => {
        Crud.updateTheDB(props.path, key_id , state.updated_text , true)
    }
    const editProjectName = (flag) =>
    {
        if(!flag)
        {
        return(
            <div>
                <Form onSubmit={setUpdateTheDB} className="mt-2">
                    <Form.Label>Update Project Name</Form.Label>
                    <Form.Control className="mb-2" type="id" placeholder="Enter Project Name" onChange={event =>  setState({updated_text:event.target.value})}/>
                    <Button variant="primary" type="submit" className="mt-3"> 
                        Submit
                    </Button>
                </Form>
            </div>
        )
        }
        else
        { return <div></div>}
    }
    if (props.type === "add") {
        return (
            <>
            <div className="project-card">
                <div className="project-card-title">
                    
                    <Form onSubmit={setWriteToDB} className="mt-2">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control className="mb-2" type="id" placeholder="Enter Project Name" onChange={event =>  setState({text:event.target.value})}/>
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
                        <NavLink
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
                        <span>
                            <i className="fa fa-trash" aria-hidden="true" onClick={setDeleteFromDB} style={{cursor:"pointer"}}></i>
                            <i className="fa fa-pencil" aria-hidden="true" onClick={()=>editProjectName(setState({flag:state.flag}))} style={{cursor:"pointer"}}></i>
                        </span>
                        {editProjectName(state.flag)
                            }
                    </div>
                </div>
            
        </>
        )
    }
}
/*
glyphicon glyphicon-trash
glyphicon glyphicon-edit
<form onSubmit={setUpdateTheDB}>
                            <input type="text" placeholder="Add Project Name" onChange={event =>  setState({updated_text :event.target.value})}/>
                            <button  type="submit">Send</button>
                        </form>
<form onSubmit={setWriteToDB}>
                        <input type="text" placeholder="Add Project Name" onChange={event =>  setState({text:event.target.value})}/>
                        <button  type="submit">Send</button>
                    </form>
const database = firebase.database();
const refURL = 'users/' + firebase.auth().currentUser.uid +'/'
const writeToDB = (evt) =>
    {
        evt.preventDefault();
        database.ref(refURL).push(text);
        //---- Reload Window --------
        window.location.reload(false);
    }
    const deleteFromDB = event =>
    {
        alert(`Do You Want to Delete ${props.title}`);
        database.ref(refURL + key_id).remove();
        window.location.reload(false);
    }
    const updateTheDB = event => 
    {
        database.ref(refURL+key_id).update({pro_text});
        window.location.reload(false);
    }
const cardDrag = (props) => {
        return (
            <Card border="dark">
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <footer>
                    <span>
                        <i className="fa fa-trash" aria-hidden="true" onClick={deleteFromDB}></i>
                        <i className="fa fa-pencil" aria-hidden="true" onClick={test} ></i>
                        {editProName(flag)
                        }
                    </span>
                    </footer>
                </Card.Body>
            </Card>
        )
    }
*/