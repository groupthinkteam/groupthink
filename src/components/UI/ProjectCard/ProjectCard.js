import React,{useState}from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"

import "./ProjectCard.scss"



export default function ProjectCard(props) {
    
    const database = firebase.database();
    const refURL = 'users/' + firebase.auth().currentUser.uid +'/'
    let [text , setText] = useState({});
    let key_id = props.key_id;
    const writeToDB = (evt) =>
    {
        evt.preventDefault();
        //alert(`Submitting Name ${text}`)
        //console.log("TEXT BEFORE :-",text);
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
    if (props.type === "add") {
        return (
            <div className="project-card">
                <div className="project-card-title">
                    <form onSubmit={writeToDB}>
                        <input type="text" placeholder="Add Project Name" onChange={event =>  setText(event.target.value)}/>
                        <button  type="submit">Send</button>
                    </form>
                </div>
            </div>)
    }
    else {
        return (
            <div className="project-card">
                <div className="project-card-title">
                    {props.title}
                    <span>
                        <i className="fa fa-trash" aria-hidden="true" onClick={deleteFromDB} ></i>
                    </span>
                </div>
            </div>
        )
    }
}