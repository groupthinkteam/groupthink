import React,{useState}from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import "./ProjectCard.scss"
import { Rnd } from "react-rnd"

export default function ProjectCard(props) {
    
    const database = firebase.database();
    const refURL = 'users/' + firebase.auth().currentUser.uid +'/'
    let [text , setText] = useState({});
    let [pro_text , setProText] = useState({});
    let [flag , setFlag] = useState(false);
    let key_id = props.key_id;
    let [hgt , setHeight] = useState({});
    let [wdt , setWidth] = useState({});
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
    const test = () =>
    {
        setFlag(true);
    }
    const editProName = (flag) =>
    {
        if(flag)
        {
        return(
            <div>
                <form onSubmit={updateTheDB}>
                            <input type="text" placeholder="Add Project Name" onChange={event =>  setProText(event.target.value)}/>
                            <button  type="submit">Send</button>
                        </form>
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
                    <form onSubmit={writeToDB}>
                        <input type="text" placeholder="Add Project Name" onChange={event =>  setText(event.target.value)}/>
                        <button  type="submit">Send</button>
                    </form>
                </div>
            </div>
            
            </>
        )
    }
    else {
        return (
            <Rnd
            default={{
                x: 150,
                y: 505
              }}
              style={{backgroundColor:"blue" , borderBlockColor:"red"}}
              onResize={(e, direction, ref, delta, position) => {setHeight(ref.offsetHeight),setWidth(ref.offsetWidth)}}
              minWidth={300}
              minHeight={200}
            >
                {
                // To change size as by streching ---->> style={{width:`${wdt}px` , height:`${hgt}px`}}
                }
            <div className="project-card" >    
                <div className="project-card-title">
                    {props.title}
                    <span>
                        <i className="fa fa-trash" aria-hidden="true" onClick={deleteFromDB}></i>
                        <i className="fa fa-pencil" aria-hidden="true" onClick={test} ></i>
                        {editProName(flag)
                        }
                    </span>
                </div>
            </div>
            </Rnd>
        )
    }
}