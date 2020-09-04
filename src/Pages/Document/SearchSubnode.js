import React,{useState} from "react";
const searchSubNodes = (nodeState,depthValue) =>
{
    //let [state,setState] = useState({nodeStatus:nodeState});
    //console.log("Search Subnode got",depthValue,nodeState)
    let flag = false;
    for (let index = 0;  nodeState!=undefined; index++) {
        Object.entries(nodeState)//state.nodeStatus)
        .map((childKey,val)=>{
            //setState({nodeStatus:childKey[1].subnodes});
            nodeState = childKey[1].subnodes
           // console.log("Got Subnode Runned",index," & Value \n",childKey[1].subnodes);
            flag=true;
         
        })
        return nodeState
    }
    
    
}
export default searchSubNodes