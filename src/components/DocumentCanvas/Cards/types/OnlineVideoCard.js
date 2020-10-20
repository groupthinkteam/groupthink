import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { metadataOfLinks } from '../Detector';
/**
 * This is an Offline Link Card Shows Videos And Audio Player .
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
//const APIKEY = 'AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc'
const OnlineVideoCard = (props) => {
    let multiplier,maxDimension;
    maxDimension = Math.max(props.content.metadata?.height, props.content.metadata?.width);
    multiplier = maxDimension > 350 ? 350 / maxDimension : 1;
    const changeSize = (height, width) => {
        props.typeAPI.resize(props.id, { width: width, height: height })
    }
    return (
        <>
            {
                props.content?.url ?
                <div
                    onLoad={e => changeSize(Math.floor(props.content.metadata.height* multiplier) + 150 , Math.floor(props.content.metadata.width * multiplier) + 5)}
                >
                    <ReactPlayer
                        url={props.content.url}
                         width={`${Math.floor(props.content.metadata.width * multiplier)}px`}
                         height={`${Math.floor(props.content.metadata.height * multiplier)}px`} 
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