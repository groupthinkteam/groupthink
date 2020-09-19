import React from 'react';
import ReactPlayer from 'react-player/lazy'
const YoutubeCard = (props) =>{
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
    {
        const heigth = Math.floor(parseInt( props.CardDetail.size.height)/1.8);
        return(
            <>
            <ReactPlayer 
                url={props.CardDetail.content.text}
                width={props.CardDetail.size.width}
                height={`${heigth}px`}  
                controls={true}  
            />
            {props.children}
            </>
        )
    }
    else
    {
        return (<div>{props.children}</div>)
    }
    
}
export default YoutubeCard;