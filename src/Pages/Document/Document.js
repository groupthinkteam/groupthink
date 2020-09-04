import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom"
import * as Crud from "./crudOpr";
import DocumentCard from "./DocumentDetail";
import '../../styles/Document.scss'
import ChildNode from "../ChildNode/ChildNode";
import  {resizableWindow as Rezzyy } from "./ResizeWindowCard";
import searchSubNodes from "./SearchSubnode";
import SubNodeReturn from "../ChildNode/SubNodes";
import Xarrow from "react-xarrows";

export default function Document(props) {
    const { projectID } = useParams();
    const box1Ref = useRef(null);
    let [state,setState] = useState(
        {
            data:{} , 
            cardInfo:null ,
            pathFrom : null,
            dataReparent:null
        });
    const wholeDocument = 'documents/'+projectID+'/'
     useEffect(()=>{
        Crud.readFROMDB(wholeDocument,data=>{
            setState
            ({
                data:data,
                cardInfo:state.cardInfo,
                pathFrom : state.pathFrom,
                dataReparent:state.dataReparent
            });
        });
        console.log("Whole Document",wholeDocument)
    },[projectID])
    let flag=true , flag_nodes=true;

    if(state.data!=null)
    {
        
        if(state.data.nodes === null || state.data.nodes === undefined)
        {
            flag_nodes= false ;
        }
        if(state.data.metadata === null || state.data.metadata === undefined)
        {
            flag=false;
        }
    }
    const createChild = () =>{
        const refURL = 'documents/'+projectID+'/nodes/'
        Crud.writeToDB(refURL,projectID,null);
    }
    const onRename = (nodeId,text,endpoint) => {
        const refURL = 'documents/'+projectID+'/nodes/'+nodeId+'/'+endpoint;
        Crud.onRename(refURL,nodeId,text)
    }
    const onStop = (data) => 
    {
        setState({data:state.data,cardInfo:data , pathFrom : state.pathFrom,
            dataReparent:state.dataReparent });
        //console.log("State On Stop",state)
    }
    const acquirePath =(path) =>
    {
        console.log("Acquire Called",path,state)
        if( state.pathFrom!= undefined || state.pathFrom!=null )
        {
            console.log("Reparent",state.pathFrom,state.dataReparent,path);
            Crud.onReparenting(state.pathFrom,state.dataReparent,path)
        }
    }
    const reparentNodesT = (pathFrom , data ) => 
    {
       console.log("Rreparent CAlled",pathFrom,data)
        setState({data:state.data,cardInfo:data ,pathFrom : pathFrom,dataReparent:data})
    }
    const subTrailNodes = (data)=>
    {
        return Object.entries(data)
                        .map((subChildKey,val)=>{
                            //console.log("Got Our ",subChildKey) 
                        // subTrailNodes(subChildKey)                        
                            return <SubNodeReturn
                            type="subnode"
                            key = {subChildKey[0]}
                            key_id= {subChildKey[0]}
                            childTitle={subChildKey[1]?.title}
                            parent={subChildKey[1]?.parent}
                            content ={subChildKey[1]?.content}
                            childDetail = {data}
                            projectId={projectID}
                            sendPath={reparentNodesT.bind(this)}
                            />
                        })
    }
    const trailNodes = (data) => 
    {
        let stDataNodes = data;
            //console.log("Under Flag Nodes",stDataNodes)
            for(let i =0;( stDataNodes!= undefined);i++)
            {
                //console.log("Loop Count",i)
                return Object.entries(stDataNodes)
                .map((childKey,val)=>{
                    stDataNodes= childKey[1].subnodes
                    
                    if(stDataNodes!= undefined)
                    {
                        trailNodes(stDataNodes);
                        return subTrailNodes(stDataNodes)
                    }
                })
               
            }
    }
    var preorderTraversal = function(root, acc = []) {
        if(!!root){
           acc.push(root.val);
           if (root.left) preorderTraversal(root.left, acc);
           if (root.right) preorderTraversal(root.right, acc);
        }
        return acc;
     };

    console.log("PREORDER TRAVERSAL ",preorderTraversal(0,[1,2]))
    return (
        <>
            <div className="document" ref={(el)=>{
                if (!el) return;
                    //-----Resizable Window---
                    Rezzyy(el,state)   
                }}
            >
            <Link to='/dashboard'>
            I was given this project ID: {projectID}.
            </Link>
            {
                flag ?
                    <DocumentCard type='parent' 
                        projecTitle={state.data.metadata.name}
                        thumbnailURL={state.data.metadata.thumbnailURL} 
                        date={new Date(state.data.metadata.datecreated ).toLocaleDateString("en-IN")}
                        coordinate={onStop.bind(this)}
                        addChild={createChild.bind(this)}
                        pathForReparent = {`documents/${projectID}/nodes/`}
                        sendPath={acquirePath.bind(this)}
                        refs={box1Ref}
                        
                    />
                : <div>Loading</div>
            }
            {
                flag && flag_nodes ? 
                Object.entries(state.data.nodes)
                .map((childKey,val)=>
                {
                   // console.log(childKey[1].subnodes )
                    return <ChildNode 
                        childTitle={childKey[1]?.title}
                        key={childKey[0]}
                        key_id={childKey[0]}
                        projectID = {projectID}
                        content ={childKey[1]?.content}
                        coordinate={onStop.bind(this)}
                        onRename={onRename.bind(this)}
                        parent={childKey[1]?.parent}
                        subNode={childKey[1]?.subnodes}
                       // depthNode ={depthNode.bind(this)}
                        childDetail={childKey}
                        pathForReparent = {`documents/${projectID}/nodes/${childKey[0]}/subnodes`}
                        sendPath={acquirePath.bind(this)}
                        refs={box1Ref}
                    />
                    
                })
                : <div>No State</div>
            }
            
            {
               flag && flag_nodes ? trailNodes(state.data.nodes) :<div>No New Subnodes</div>

            }
            {
                flag && flag_nodes ? 
                <div>OK</div>
                :<div>Nothing</div>
            }
            </div>

        </>
    )
}
/**
 * let subNodesContain = null;
    const depthNode = (childState,depthValue)=>
    {
        //console.log("depth Value",depthValue);
        //console.log("In Search Node \n",searchSubNodes(childState,depthValue));
        subNodesContain = searchSubNodes(childState,depthValue);
        setState({data:state.data,cardInfo:state.cardInfo ,subNodes : state.subNodes, subNodesContain:subNodesContain});
        //console.log("Subnode contain",state.subNodesContain)
    }
 * {
               /* state.subNodesContain != null ?
                Object.entries(state.subNodesContain)
                .map((childKey,val)=>{
                    return <SubNodeReturn
                        type="subnode"
                        key = {childKey[0]}
                        key_id= {childKey[0]}
                        childTitle={childKey[1]?.title}
                        parent={childKey[1]?.parent}
                        content ={childKey[1]?.content}
                    />
                })
                
                : <div>No Subnodes </div> 
            }
 * const allOverNode = (nodeState,depth) =>
    {
        subNodesContain = searchSubNodes(nodeState,depth);
        //setState({data:state.data,cardInfo:state.cardInfo , subNodesContain:subNodesContain});
        Object.entries(subNodesContain)
                .map((childKey,val)=>{
                    return <ChildNode
                        type="subnode"
                        key = {childKey[0]}
                        key_id= {childKey[0]}
                        childTitle={childKey[1]?.title}
                        parent={childKey[1]?.parent}
                        content ={childKey[1]?.content}
                    />
                })
        
    }

    if(flag_nodes)
        {
            
            let stDataNodes = state.data.nodes;
            console.log("Under Flag Nodes",stDataNodes)
            for(let i =0;(stDataNodes!=null || stDataNodes!= undefined);i++)
            {
                
                Object.entries(stDataNodes)
                .map((childKey,val)=>{
                    stDataNodes= childKey[i].subnodes
                    console.log("Got Our ",childKey[0],childKey[1].parent, childKey[1].title);
                })
                
            }
        }
 * Object.entries(subNodesContain)
                .map((childKey,val)=>{
                    return <ChildNode
                        type="subnode"
                        key = {childKey[0]}
                        key_id= {childKey[0]}
                        childTitle={childKey[1]?.title}
                        parent={childKey[1]?.parent}
                        content ={childKey[1]?.content}
                    />
                })
 * else
                    {
                       return( Object.entries(childKey[1].subnodes)
                        .map((childkey,val)=>
                        {
                            return <ChildNode 
                            childTitle={childkey[1]?.title}
                            key={childkey[0]}
                            key_id={childkey[0]}
                            projectID = {projectID}
                            content ={childkey[1]?.content}
                            coordinate={onStop.bind(this)}
                            onRename={onRename.bind(this)}
                            parent={childkey[1]?.parent}
                        />
                        }))
                    }
 */