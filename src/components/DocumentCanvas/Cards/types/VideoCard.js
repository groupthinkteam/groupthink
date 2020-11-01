import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
/**
 * This Uploads The Video File in Storage And also can Stream the File.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const VideosCard = (props) => {
    const [videoState, setVideo] = useState({ fileName: '', url: '', height: '', width: '' });
    const changeSize = (height, width) => {
        props.typeAPI.resize(props.id, { width: width, height: height + 50 })
    }
    const onSave = (fileName, url) => () => {
        if (videoState.fileName.length > 1)
            props.typeAPI.saveContent(props.id,
                {
                    ...props.content,
                    [videoState.fileName]:
                    {
                        ...props.content[fileName],
                        "metadata":
                        {
                            ...props.content[fileName]["metadata"],
                            name: videoState.fileName
                        },
                        "url": url,
                        height: videoState.height,
                        width: videoState.width
                    },
                    [fileName]: null
                });
    }
    const onLoadDiv = (fileName, url, height, width) => {
        setVideo({
            fileName: fileName,
            url: url,
            height: height,
            width: width
        });
        changeSize(height, width)
    }

    const maxDimension = Math.max(props.content?.height, props.content?.width);
    const multiplier = maxDimension > 450 ? 450 / maxDimension : 1;

    return (
        <div key={"video" + props.id} >
            <InlineTextEdit
                onChange={(e) => setVideo({ fileName: e.target.props.contentue, url: videoState.url, height: videoState.height, width: videoState.width })}
                onSave={onSave(props.id, props.content?.url)}
                placeholder="Enter File Name ...."
                text={videoState.fileName}
                lwidth={"100px"}
                disabled={props.isLocked}
                target="_blank"
                style={{ color: "darkblue", textAlignLast: 'center', width: "40%" }}
            />
            <ReactPlayer
                controls={true}
                url={props.content?.url}
                height={`${Math.floor(props.content.height * multiplier)}px`}
                width={`${Math.floor(props.content.width * multiplier)}px`}
            />
        </div>
    )
}
export default React.memo(VideosCard);
