import React from "react";
import Button from "../../../Button/Button";

/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
function BlankCard(props) {

    let types = ["text", "image", "VideoLink", "VideoFile", "link", "audio", "pdf", "file"]

    return (
        <div className="button_link">
            {types.map((type) =>
                <Button handleClick={() => props.typeAPI.changeType(props.id, type)}>
                    {type}
                </Button>)}
        </div>
    )
}

export default React.memo(BlankCard)