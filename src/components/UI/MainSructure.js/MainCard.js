import React , {useState} from "react"
import "./MainCard.scss"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import { Rnd } from "react-rnd"
import { Button , Form} from "react-bootstrap";
import * as Crud from "../../../CRUDopr";
export default function MainCard(props)
{
    console.log("MAIN CARD",props.title,props.childID);
    const refURL = `projects/${firebase.auth().currentUser.uid}/${props.projectID}/`;
    let [state,setState] = useState({
        path: props.path,
        text : '',
        updated_text : ''
    })
    const setWriteToDB = () => {
        console.log("PATH Project", state.path)
        Crud.writeToDB(refURL  , {title: state.text} , false);
    }  
    const setDeleteFromDB = () =>{
        Crud.deleteFromDB(refURL,props.title,props.projectID)
    } 
    const setUpdateTheDB = () => {
        Crud.updateTheDB(props.path, key_id , state.updated_text , true)
    }
    const insertName = (flag) =>
    {
        if(!flag)
        {
        return(
            <div>
                <Form onSubmit={setWriteToDB} className="mt-2">
                    <Form.Label>Project Child Name</Form.Label>
                    <Form.Control className="mb-2" type="id" placeholder="Enter Child Name" onChange={event =>  setState({text:event.target.value})}/>
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
    if(props.type === "start")
    {
        return(
            <>
                <Rnd
                    default={{
                        x: 150,
                        y: 505
                    }}
                    // style={{backgroundColor:"blue" , borderBlockColor:"red"}}
                    onResize={(e, direction, ref, delta, position) => {console.log("Height & Width",(ref.offsetHeight),(ref.offsetWidth))}}
                    minWidth={300}
                    minHeight={200}
                    >
                    <div className="project-card">
                        <div className="project-card-title">
                            {props.title}    
                        </div>
                       
                        {insertName(false)}
                    </div>
                </Rnd>
            </>
        )
    }
    if(props.type === "add")
    {
        return(
            <>
                <Rnd
                    default={{
                        x: 150,
                        y: 505
                    }}
                    // style={{backgroundColor:"blue" , borderBlockColor:"red"}}
                    onResize={(e, direction, ref, delta, position) => {console.log("Height & Width",(ref.offsetHeight),(ref.offsetWidth))}}
                    minWidth={300}
                    minHeight={200}
                    >
                    <div className="project-card">
                        <div className="project-card-title">
                            {props.title}    
                        </div>
                        <span>
                            <i className="fa fa-trash" aria-hidden="true" onClick={setDeleteFromDB} style={{cursor:"pointer"}}></i>
                            <i className="fa fa-pencil" aria-hidden="true" onClick={()=>insertName(false)} style={{cursor:"pointer"}}></i>
                        </span>
                        {insertName}
                    </div>
                </Rnd>
            </>
        )
    }

}