import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
/**
 * This is an Offline Link Card Shows Videos And Audio Player .
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
//const APIKEY = 'AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc'
const OnlineVideoCard = (props) => {
    const [multiplier, setMultiplier] = useState();
    const [dimension, setDimension] = useState();
    useEffect(() => {
        const changeSize = (height, width) => {
            props.typeAPI.resize(props.id, { width: width, height: height })
        }
        if (props.content.metadata?.error === undefined) {
            let height = typeof props.content.metadata?.height === 'number' ? props.content.metadata?.height : 350;
            let width = typeof props.content.metadata?.width === 'number' ? props.content.metadata?.width : 350;
            let temp = Math.max(height, width)
            setDimension({ width: width, height: height })
            setMultiplier(temp >= 350 ? 350 / temp : 1);
            temp = temp >= 350 ? 350 / temp : 1;
            console.log("CHANGES ", temp, Math.floor(height * temp) + 35);
            console.log("CHANGES ", Math.floor(width * temp));
            changeSize(Math.floor(height * temp) + 50, Math.floor(width * temp))
        }

    }, [props.content.metadata, props.id, props.typeAPI, props.content.text])
    return (
        dimension && props.content?.text === undefined ?
            <div>
                <ReactPlayer
                    url={props.content.url}
                    width={`${Math.floor(parseInt(dimension.width) * multiplier)}px`}
                    height={`${Math.floor(parseInt(dimension.height) * multiplier)}px`}
                    controls={true}
                />
                <a style={{ color: 'red' }} href={props.content.metadata.url}>{props.content.metadata.title}</a>
            </div>
            : null
    )
}
export default React.memo(OnlineVideoCard);