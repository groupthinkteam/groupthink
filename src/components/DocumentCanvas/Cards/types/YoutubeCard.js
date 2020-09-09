import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy'
import { Rnd } from 'react-rnd';
import { Card } from 'react-bootstrap';
const YoutubeCard = (props) =>{
    const [state,setState] = useState();
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
        <ReactPlayer 
            url={props.CardDetail.content.text}
            width={props.CardDetail.size.width}
            height={props.CardDetail.size.height}  
            controls={true}  
        />
    )
    else
    {
        return (<div></div>)
    }
    
}
export default YoutubeCard;