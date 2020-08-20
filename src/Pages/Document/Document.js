import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { APP_CONSTANTS } from '../../constants/appConstants';
import * as Crud from '../../Helpers/crudOpr';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import { Link } from 'react-router-dom';

const Document = (props) =>{
    const location = useLocation();
    const history = useHistory();
    const {auth,authState} = useAuth();
    const projectDetail = {
        title : location.state.projectTitle,
        projectID : location.state.projectID,
        projectPath : location.state.projectPath
    }
    let [state,setState] = useState();
    const refURL = {
        projectNodes :   'documents/'+projectDetail.projectID+'/nodes/',
        projectMetadata : 'documents/'+projectDetail.projectID+'/metadata',
        permitUser : 'documents/'+projectDetail.projectID+'/users'
    };
    
    const sendWriteToDB = (refURL,text) => {
        if(refURL != null && text != '')
        {
        Crud.writeToDB(refURL,text,false);
        }
    }
    const sendDeleteToDB = (refURL,title,id) => {
          Crud.deleteFromDB(refURL,title,id,false);
          console.log("Called dash Delete")
    }
    const sendUpdateToDB = (refURL,id,text) => {
        if(refURL != null && text != '')
        {
          Crud.updateTheDB(refURL,id,text,false);
          console.log("Called dash write")
        }
    }
    useEffect(()=>{
        Crud.readFROMDB(refURL.projectNodes,data=>{
            setState(data);
        })
    },[])
    //const bf = () => 
    let flag = false;
    if(state!=null)
    {
        Object.entries(state)
        .map((childKey , val) => {
            console.log("Tried",childKey[1]?.title)
        })
        
        flag=true;
    }
    return (
        <div>
            <Link to="/dashboard">Go Back </Link>
            <DocumentCard type='parent' title={projectDetail.title} sendWriteToDB={sendWriteToDB.bind(this)} />
            {
                flag ? Object.entries(state)
                .map((childKey , val) => {
                    //console.log("Tried",childKey[1]?.title)
                   return <DocumentCard 
                        title={childKey[1]?.title}
                        content ={childKey[1]?.content}
                        nodePath = {refURL.projectNodes}
                        sendDeleteToDB={sendDeleteToDB.bind(this)}
                        sendUpdateToDB={sendUpdateToDB.bind(this)}
                    />
                })
                : <div>No State</div>
            }
        </div>
    )
}
export default Document;