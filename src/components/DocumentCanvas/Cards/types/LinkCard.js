import React from 'react';
import { ReactTinyLink } from 'react-tiny-link';
/**
 * This Card Shows The Link's image description in single card
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const LinkCard = (props) => {
    return (
        <>
            
            {
                props.content?.url ?
                <div>
                    <ReactTinyLink
                        cardSize="small"
                        showGraphic={true}
                        maxLine={2}
                        minLine={1}
                        url={props.content.url}
                    />
                </div>
                : null    
            }
        </>
    )

}
export default React.memo(LinkCard);