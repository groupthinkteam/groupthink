import React,{useState,useEffect} from 'react';
import { ReactTinyLink } from 'react-tiny-link';
/**
 * This Card Shows The Link's image description in single card
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const LinkCard = (props) => {
    
    const [maxDimension,setMaxDimension]=useState();
    const [multiplier,setMultiplier]=useState();
    useEffect(()=>{
        const changeSize = (height, width) => {
            props.typeAPI.resize(props.id, { width: width, height: height })
        }
        console.log('Metadata Error ', typeof props.content.metadata?.error)
        if( props.content.metadata?.height !== undefined )
        {
            let height= typeof props.content.metadata?.height ==='number' ?props.content.metadata?.height:350;
            let width=typeof props.content.metadata?.width ==='number' ?props.content.metadata?.width:350;
            let  temp = Math.max(height,width)
            setMaxDimension(temp);
            setMultiplier(temp >= 350 ? 350 / temp : 1);
            temp = temp >= 350 ? 350 / temp : 1 ;
            console.log("CHNAGES ",temp,Math.floor(height * temp) + 35);
            console.log("CHNAGES ",Math.floor(width  * temp));
            changeSize(Math.floor(height * temp) + 35 , Math.floor(width  * temp))
        }
    },[props.content.metadata, props.content.metadata.height, props.content.metadata.width, props.id, props.typeAPI])
    console.log("props.content.metadata ",props.content.metadata , maxDimension , multiplier);
    return (
        <>
            
            {
                props.content.url?
                <div>
                    {
                        props.content.metadata?.error !== undefined ?
                        <ReactTinyLink
                            cardSize="small"
                            showGraphic={true}
                            maxLine={2}
                            minLine={1}
                            url={props.content.url}
                        />
                        :
                        <>
                        <div 
                            dangerouslySetInnerHTML={{__html:props.content.metadata?.html}}
                        ></div>
                        <a href={props.content.url}>{props.content.metadata.title}</a> 
                        </>
                    }
                    
                </div>
                : null    
            }
        </>
    )

}
export default React.memo(LinkCard);