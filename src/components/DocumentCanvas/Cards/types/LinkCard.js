import React from 'react';
import { ReactTinyLink } from 'react-tiny-link'

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
    if(validURL(props.CardDetail.content.text))
    return(
        <div style={{ boxShadow: "2px 4px 21px 9px darkgrey" , marginTop : "22px"}}>
            <ReactTinyLink
                cardSize="small"
                showGraphic={true}
                maxLine={2}
                minLine={1}
                url={props.CardDetail.content.text}
                width={props.CardDetail.size.width}
                height={props.CardDetail.size.height}
            />
            {props.children}
        </div>
    )
    else
    {
        return(<div>{props.children}</div>)
    }
}
export default LinkCard;