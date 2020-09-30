import React from 'react';
import ReactPlayer from 'react-player/lazy'
import InlineTextEdit from "../../../InlineTextEdit/InlineTextEdit"
/**
 * This is an Offline Link Card Shows Videos And Audio Player .
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const OnlineVideoCard = (props) => {
    const validURL = (str) => {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    const onSave = () => props.typeAPI.saveContent(props.id, { url: props.content.url })
    const onChange = (event) => props.typeAPI.changeContent(props.id, { url: event.target.value })

    return (
        <>
            <div className="text-node">
                <InlineTextEdit
                    onChange={(e) => onChange(e)}
                    onSave={onSave}
                    text={props.content?.url || props.content.text}
                    lwidth={"100px"}
                />
            </div>
            {
                validURL(props.content?.url) ?
                    <div >
                        <ReactPlayer
                            url={props.content.url}
                            //width={props.CardDetail.size.width}
                            //height={`${heigth}px`}  
                            controls={true}
                        />
                    </div>
                    : null
            }
        </>
    )
}
export default React.memo(OnlineVideoCard);