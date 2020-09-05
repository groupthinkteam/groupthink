import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom"
import * as Crud from "./crudOpr";
import DocumentCard from "./DocumentDetail";
import '../../styles/Document.scss'
import ChildNode from "../ChildNode/ChildNode";
import  {resizableWindow as Rezzyy } from "./ResizeWindowCard";

export default function Document(props) {
    const { projectID } = useParams();
    let [state,setState] = useState(
        {
            data:{} , 
            cardInfo:null ,
            requestId:null
        });
    const wholeDocument = 'documents/'+projectID+'/'
     useEffect(()=>{
        Crud.readFROMDB(wholeDocument,data=>{
            setState
            ({
                data:data,
                cardInfo:state.cardInfo,
                requestId:state.requestId
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
        setState({data:state.data,cardInfo:data ,requestId:state.requestId });
        //console.log("State On Stop",state)
    }
    const acquireId =(acquiredId) =>
    {
        console.log("Acquire Called",acquiredId,state)
        if( state?.requestId!= undefined || state?.requestId!=null )
        {
            console.log("Reparent",state.requestId);
            Crud.onReparenting(projectID,state.requestId,acquiredId)
        }
    }
    const reparentNodesT = (requestId) => 
    {
       console.log("Rreparent CAlled",requestId)
        setState({data:state.data,cardInfo:state.cardInfo ,requestId:requestId})
    }
    
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
                        sendPath={acquireId.bind(this)}
                        reparentPath={reparentNodesT.bind(this)}
                        //refs={box1Ref}
                        key_id={projectID}
                        
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
                        sendPath={acquireId.bind(this)}
                        reparentPath={reparentNodesT.bind(this)}
                        //refs={box1Ref}
                    />
                    
                })
                : <div>No State</div>
            }
            
            
            </div>

        </>
    )
}
/**
 * const subTrailNodes = (data)=>
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
 * {
               flag && flag_nodes ? trailNodes(state.data.nodes) :<div>No New Subnodes</div>

            }
            {
                flag && flag_nodes ? 
                <div>OK</div>
                :<div>Nothing</div>
            }
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