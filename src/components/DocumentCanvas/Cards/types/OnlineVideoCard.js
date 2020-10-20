import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { metadataOfLinks } from '../Detector';
/**
 * This is an Offline Link Card Shows Videos And Audio Player .
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
//const APIKEY = 'AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc'
const OnlineVideoCard = (props) => {
    //let multiplier,maxDimension;
    const [maxDimension,setMaxDimension]=useState();
    const [multiplier,setMultiplier]=useState();
    const [dimension,setDimension] = useState();
    useEffect(()=>{
        const changeSize = (height, width) => {
            props.typeAPI.resize(props.id, { width: width, height: height })
        }
        if(props.content.metadata?.error === undefined)
        {
            let height= typeof props.content.metadata?.height ==='number' ?props.content.metadata?.height:350;
            let width=typeof props.content.metadata?.width ==='number' ?props.content.metadata?.width:350;
            let  temp = Math.max(height,width)
            setMaxDimension(temp);
            setDimension({width:width , height:height})
            setMultiplier(temp >= 350 ? 350 / temp : 1);
            temp = temp >= 350 ? 350 / temp : 1 ;
            console.log("CHNAGES ",temp,Math.floor(height * temp) + 35);
            console.log("CHNAGES ",Math.floor(width  * temp));
            changeSize(Math.floor(height * temp) + 35 , Math.floor(width  * temp))
        }
    
    },[])
    //console.log("PROPS ",props.content.metadata , maxDimension,multiplier,parseInt(props.content.metadata?.width),Math.floor(parseInt(props.content.metadata?.height) * multiplier) + 5)
    return (
        <>
            {
                dimension !== undefined ?
                <div>
                    <ReactPlayer
                        url={props.content.url}
                        width={`${Math.floor(parseInt(dimension.width) * multiplier)}px`}
                        height={`${Math.floor(parseInt(dimension.height )* multiplier)}px`} 
                        controls={true}
                        light={true}
                    />
                    <a style={{color:'red'}} href={props.content.metadata.url}>{props.content.metadata.title}</a>
                </div>
                : null
            }
        </>
    )
}
export default React.memo(OnlineVideoCard);