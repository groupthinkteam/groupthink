import React, { useContext , useState,useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { APP_CONSTANTS } from "../../constants/appConstants"
import { useAuth } from '../../services/auth'
import Button from '../../components/Button'
import AppContext from '../../contexts/AppContext'
import * as Crud from '../../Helpers/crudOpr';
import ProjectCard from '../../components/ProjectCard/ProjectCard';

const Dashboard = () => {
  const appContext = useContext(AppContext)
  //console.log("Global UID",appContext.uid);
  const history = useHistory()
  const { auth, authState } = useAuth();
  const logout = () => {
    auth().signOut().then(() => history.push(APP_CONSTANTS.URLS.LOGIN_URL))
  }
  let flag = false; 
  let refURL =''  //'users/'+ auth().currentUser.uid +'/';
  if(auth().currentUser != null)
  {
    refURL='users/'+ authState.user.uid +'/projects';
    //console.log("URL With Condition",refURL);
    flag=true;
  }
  let [projectCards , setProject] = useState({});
  const uid = authState.user?.uid;
  //console.log("UID in Dash",uid)
  useEffect(()=>{
      if(uid)
      {
        refURL='users/'+ uid +'/projects';
        console.log("URL Passed in CRUD",refURL)
        //Crud.writeToDB(refURL,'Test1',false);
        Crud.readFROMDB(refURL , data => {
           // console.log("DashBOard Data",data);
            setProject(data);
            flag=true;
      });
      }
  },[uid]) 
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
  
  return (
    <div>
      {/* get data from context can be used as global state */}
      Welcome to <h3>{appContext.appname}</h3>
      Dashboard, {authState.user ? authState.user.displayName : "waiting"}. <br />
      <Button handleClick={logout}>
        Logout
      </Button>
      <div className="dashboard-card-container">
                <ProjectCard type="add" path={refURL} sendWriteToDB={sendWriteToDB.bind(this)} />
                {
                  flag ?  Object.entries(projectCards)
                    .map(([project_key,project_name])=> 
                    <ProjectCard 
                        title={project_name} 
                        key={project_key} 
                        key_id={project_key}
                        path = {`${refURL}`}
                        sendDeleteToDB={sendDeleteToDB.bind(this)}
                        sendUpdateToDB={sendUpdateToDB.bind(this)}
                   />)
                   : <div>No User</div>
                } 
                
      </div>
    </div>
  )
}

export default Dashboard
