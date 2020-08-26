import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import * as Crud from "./crudOpr";
import DocumentCard from "./DocumentDetail";
import '../../styles/Document.scss'
export default function Document(props) {
    const { projectID } = useParams();
    let [state,setState] = useState(
        {
            data:{} , 
            cardInfo:null , 
            initialHeight : window.innerHeight , 
            initialWidth: window.innerWidth
        });
    const wholeDocument = 'documents/'+projectID+'/'
     useEffect(()=>{
        Crud.readFROMDB(wholeDocument,data=>{
            setState
            ({
                data:data,
                cardInfo:state.cardInfo ,
                initialHeight:state.initialHeight , 
                initialWidth:state.initialWidth
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
    const onStop = (data) => 
    {
        setState({data:state.data,cardInfo:data , initialHeight:state.initialHeight , initialWidth:state.initialWidth});
        console.log("State On Stop",state)
        //var docCenter = {xCenter : state.data.innerX , yCenter : state.data.innerY};
        //var distanceFromCenter = state.data.distance;
        //console.log("Center Coordinate , Distance",docCenter,distanceFromCenter)
    }
    console.log("Inner H W ",window.innerHeight,window.innerWidth)
    return (
        <>
            <div className="document" ref={(el)=>{
                if (!el) return;
                //console.log("CONDITION",((state.data.y+state.data.height)>window.innerHeight || (state.data.x+state.data.width)>window.innerWidth))
                    if(state.cardInfo!= null)
                    {
                        if((state.cardInfo.y+state.cardInfo.height)>window.innerHeight)
                        {
                            window.innerHeight = window.innerHeight + state.cardInfo.height;
                            el.style.height = `${window.innerHeight}px`
                        }
                        if((state.cardInfo.x+state.cardInfo.width)>window.innerWidth)
                        {
                            window.innerWidth = window.innerWidth + state.cardInfo.width;
                            el.style.width = `${window.innerWidth}px`;
                        }
                      //console.log("Runned Condition ",window.innerHeight,window.innerWidth,state.cardInfo)
                      //-------- Scroll on CO-ordinate -----
                      //window.scroll(state.cardInfo.x,state.cardInfo.y);          
                    }
                    else 
                    {
                      el.style.height = `${window.innerHeight}px`;
                      el.style.width = `${window.innerWidth}px`;
                      //console.log("Runned Else Condition ",window.innerHeight,window.innerWidth)
                    }
                    
                    if(window.innerHeight >state.initialHeight && state.cardInfo.old_y > state.cardInfo.y) 
                    {
                        window.innerHeight = window.innerHeight - state.cardInfo.height;
                        el.style.height = `${window.innerHeight}px`
                    }
                    if(window.innerWidth >state.initialWidth && state.cardInfo.old_x > state.cardInfo.x)
                    {
                        window.innerWidth = window.innerWidth - state.cardInfo.width;
                        el.style.width = `${window.innerWidth}px`  ;
                    }
                     
                      
                    //console.log("Scrolled Up ",window.innerHeight,window.innerWidth,state.cardInfo)    
                }}
            >
            I was given this project ID: {projectID}.
            {
                flag ?
                    <DocumentCard type='parent' 
                        projecTitle={state.data.metadata.name}
                        thumbnailURL={state.data.metadata.thumbnailURL} 
                        date={new Date(state.data.metadata.datecreated ).toLocaleDateString("en-IN")}
                        coordinate={onStop.bind(this)}
                    />
                : <div>Loading</div>
            }
            {
                flag && flag_nodes ? 
                Object.entries(state.data.nodes)
                .map((childKey,val)=>
                {
                    return <DocumentCard 
                        childTitle={childKey[1]?.title}
                        key={childKey[0]}
                        key_id={childKey[0]}
                        content ={childKey[1]?.content}
                        coordinate={onStop.bind(this)}
                    />
                })
                : <div>No State</div>
            }
            </div>
        </>
    )
}