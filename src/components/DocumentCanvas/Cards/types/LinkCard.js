import React from 'react';
import LinkPreview from '@ashwamegh/react-link-preview'
import "../../../../styles/Cards/LinkCard.scss"

const LinkCard = (props) => {
    return (
        <LinkPreview url={props.content.url} render={LinkDisplay} />
    )
}

const LinkDisplay = ({ loading, preview }) => {
    return loading
        ? (<h1>Loading...</h1>)
        : (
            <div className="link-card">
                <img height="100px" width="100px" src={preview.img} alt={preview.title} />
                <div className="text">
                    <div className="title">
                        <img alt="link-title" src={require("../../../../assets/link-logo.svg")} />{preview.title}</div>
                    <div className="description">{preview.description}</div>
                    <div className="domain">{preview.domain}</div>
                </div>
            </div>
        )
}

export default React.memo(LinkCard);