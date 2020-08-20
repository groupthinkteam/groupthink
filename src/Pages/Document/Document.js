import React, { useState, useEffect } from 'react';
import { useLocation, useHistory , Redirect} from 'react-router-dom';
import * as Crud from '../../Helpers/crudOpr';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import { Link } from 'react-router-dom';

const Document = (props) =>{
    const location = useLocation();
    const logout = () => {
        props.signOut()
        return (
          <Redirect to={{
            pathname: "/login",
            state: { from: location }
          }}
          />
        )
    }
    const projectDetail = {
        title : location.state.projectTitle,
        projectID : location.state.projectID,
        projectPath : location.state.projectPath
    }
    let [state,setState] = useState();
    const refURL = {
        projectNodes :   'documents/'+projectDetail.projectID+'/nodes',
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
        if(refURL != undefined && text != '')
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
    
    return (
        <div>
            <Link to="/dashboard">Go Back </Link>
            <DocumentCard type='parent' projectTitle={projectDetail.title} nodePath = {refURL.projectNodes} sendWriteToDB={sendWriteToDB.bind(this)} />
            {
                state!=null ? Object.entries(state)
                .map((childKey , val) => {
                    //console.log("Tried",childKey[1]?.title)
                   return <DocumentCard 
                        childTitle={childKey[1]?.title}
                        key={childKey[0]}
                        key_id={childKey[0]}
                        content ={childKey[1]?.content}
                        nodePath = {refURL.projectNodes}
                        metadataPath = {refURL.projectMetadata}
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