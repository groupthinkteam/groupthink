import React from "react";
import Button from "../../../Button/Button";

/**
 * @description The BlankCard type provides the UI for a newly-added card. It 
 * has buttons that let the user select which card type they want to use. Hence,
 * it makes use of the changeType function.
 * @param {*} props 
 */
export default function BlankCard(props) {

    let types = ["text", "image", "onlineVideo", "personalVideo", "link", "audio", "PDF"]

    return (
        <div className="button_link">
            {types.map((type) =>
                <Button handleClick={() => props.cardAPI.type(props.id, type)}>
                    {type}
                </Button>)}
        </div>
    )
}