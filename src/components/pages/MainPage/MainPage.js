import React, { useState, useEffect } from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import MainCard from "../../UI/MainSructure.js/MainCard"
import * as Crud from "../../../CRUDopr"
import { NavLink , useLocation} from "react-router-dom"
//*
export default function MainPage(props)
{
    const location = useLocation();
    const projectProps = location.projectDetail;
    console.log("Detail Prop",useLocation());
    let propsDetail = 
    {
        title : projectProps.projectTitle,
        projectID : projectProps.projectID,
        projectPath : projectProps.projectPath,
    }
    let [state,setState] = useState({
        projectChildData : null
    })
    const refURL = `projects/${firebase.auth().currentUser.uid}/${projectProps.projectID}/`;
    useEffect(()=>{
        Crud.readFROMDB(refURL,data=>{
            setState({projectChildData:data});
        })
    },[])
    const chilDetail = [];
    console.log("Main State",state);
    let childCards;
    if(state.projectChildData !=null)
    {
        //childCards = () => {
            // obj = [-jsdkn : {title : "kjfd"}]
               console.log("Entered in Child Cards")
               Object.entries(state.projectChildData)
               .map((childkey,childvalue)=>{
                   console.log(childkey);
                       chilDetail.push(childkey)
                 //  Object.values(childValue)
                  //  .map((v)=> {return <MainCard type='add' key={childkey} childId={childkey} title={childValue.title} path={refURL} projectID={projectProps.projectID} />})
         //         return <MainCard type='add' key={childkey} childId={childkey} title={Object.values(childvalue).map((v)=>{return v.title})} path={refURL} projectID={projectProps.projectID} />}
                } )
       //}
    }
    return(
        <>
        <NavLink to='/'>Go Back</NavLink>
        <MainCard type='start' title={projectProps.projectTitle} path={refURL} projectID={projectProps.projectID}/>
        {console.log("Ch",chilDetail)}
        {
           Object.entries(chilDetail)
                            .map((childKey,childValue)=>{
                               // console.log("last",childKey);
                                <MainCard type='add' childID={childkey} key={childkey} title={Object.values(childkey).map((v)=>{return v.title})} path={refURL} projectID={projectProps.projectID} />
                            })
        }
        </>
    )
}
/*
Object.entries(state.projectChildData)
            .map((key,value)=>{console.log("entry",key,value.title , Object.values(key).map((v)=> {return v.title}))})
Object.values(state.projectChildData)
                .map((projectKey)=>{
                    
                   chilDetail.push(projectKey)  ;   
                    
                })
                console.log('Project Child Details',chilDetail);
Object.keys(state.projectChildData)
            .map((key)=>{console.log("entry child",key)})
{
            Object.entries(state.projectChildData)
            .map((key,value)=>{
                 Object.values(key)
                 .map((v)=> {return <MainCard type='add' key={key} title={v.title} path={refURL} projectID={projectProps.projectID} />})
            })
        }
*/