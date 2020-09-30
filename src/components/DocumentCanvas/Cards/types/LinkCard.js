import React from 'react';
import { ReactTinyLink } from 'react-tiny-link'
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit"
/**
 * This Card Shows The Link's image description in single card
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const LinkCard = (props) => 
{
    const validURL = (str) => {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }
    const onSave = () => validURL(props.content.url) ? props.typeAPI.saveContent(props.id,{ url: props.content.url }) : null
    const onChange = (event) => props.typeAPI.changeContent(props.id,{url:event.target.value})
    
    return(
        <>
            <div className="text-node">
                <InlineTextEdit
                    onChange={(e)=>onChange(e)}
                    onSave={onSave}
                    text={props.content?.url || props.content.text}
                    lwidth={"100px"}
                />
            </div>
            {
                validURL(props.content?.url) ? 
                <div style={{ boxShadow: "2px 4px 21px 9px darkgrey" , marginTop : "22px"}}>
                    <ReactTinyLink
                        cardSize="small"
                        showGraphic={true}
                        maxLine={2}
                        minLine={1}
                        url={props.content.url}
                        //width={props.size.width}
                        //height={props.size.height}
                    />
                </div>
                :null
            }
        </>
    )    
    
}
export default React.memo(LinkCard);