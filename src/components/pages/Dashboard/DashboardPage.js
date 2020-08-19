import React, { useState, useEffect } from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import ProjectCard from "../../UI/ProjectCard/ProjectCard"
import "./DashboardPage.scss"
import * as Crud from "../../../CRUDopr"


 const  DashboardPage = (props)  => {
    const database = firebase.database();
    const refURL = 'users/' + firebase.auth().currentUser.uid +'/' ;
    //console.log("REF",refURL);
    let [projectCards , setProject] = useState({});    
    //console.log("Got in DashBoard",Crud.readFROMDB(refURL));
      
      useEffect(()=>{
        Crud.readFROMDB(refURL , data => {
            console.log("DashBOard Data",data);
            setProject(data);
        });
      },[]) 
    return (
        <div >
            
            <div className="dashboard-card-container">
                <ProjectCard type="add" path={refURL} />
                { //console.log("interpolated Project CArd \n" , projectCards)
                }
                
                {
                    Object.entries(projectCards)
                    .map(([project_key,project_name])=> 
                    <ProjectCard 
                        title={project_name} 
                        key={project_key} 
                        key_id={project_key}
                        path = {`${refURL}`}
                   />)
                }
                
            </div>
        </div>
    )
}
export default DashboardPage;
/*
function readFromDB() {
        // database.ref(refURL).on('value', (snapshot) => setProjectCards(snapshot.val()));
        database.ref(`${refURL}`).once('value')
            .then((snapshot) => {
                console.log('Snapshot ', snapshot);
                setProjectCards(snapshot.val());
            });
    }
 //----- For Debug ----
    const reload = () => {
        window.location.reload(false);
    }
    const writeToDB = ( text) =>
    {
        evt.preventDefault();
        database.ref(refURL).push(text);
        //---- Reload Window --------
        reload();
    }
    const deleteFromDB = ( title , id) =>
    {
        alert(`Do You Want to Delete ${title}`);
        database.ref(refURL +id).remove();
        reload();
    }
    const updateTheDB = (id ,text) => 
    {
        database.ref(refURL+id).update({text});
        reload();   
    } 
*/