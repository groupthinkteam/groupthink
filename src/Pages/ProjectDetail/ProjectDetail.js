import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { APP_CONSTANTS } from '../../constants/appConstants';
import * as Crud from '../../Helpers/crudOpr';

const ProjectDetail = () => {
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
    
    const sendWritetoDB = () => {
        Crud.writeToDB(refURL,{content : `child of ${projectDetail.title}` , isLock : false} , false);
    }
    useEffect(()=>{
        Crud.writeToDB(refURL.projectMetadata,{title : `${projectDetail.title}`} , false);
    },[])
    return(<div>Project Detail</div>)
}
export default ProjectDetail