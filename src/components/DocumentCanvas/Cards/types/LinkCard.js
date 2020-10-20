import React from 'react';
import { ReactTinyLink } from 'react-tiny-link';
/**
 * This Card Shows The Link's image description in single card
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const LinkCard = (props) => {
    
    let multiplier,maxDimension , htmlChange;
    if( props.content.metadata?.error === undefined)
    {
        maxDimension = Math.max(props.content.metadata?.height, props.content.metadata?.width);
        multiplier = maxDimension > 500 ? 3500 / maxDimension : 1;
    }
    const changeSize = (height, width) => {
        console.log("TYEST ")
        props.typeAPI.resize(props.id, { width: width, height: height })
    }
    console.log("props.content.metadata ",props.content.metadata , maxDimension , multiplier);
    return (
        <>
            
            {
                props.content?.url ?
                <div
                    onLoad={e =>props.content.metadata?.error === undefined? changeSize(Math.floor(props.content.metadata.height * multiplier) + 150 , Math.floor(props.content.metadata.width * multiplier) + 5) : console.log(e)}
                >
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
                            dangerouslySetInnerHTML={{__html:props.content.metadata.html}}
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