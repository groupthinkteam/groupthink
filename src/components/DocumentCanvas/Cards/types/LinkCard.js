import React from 'react';
import LinkPreview from '@ashwamegh/react-link-preview'
import "../../../../styles/Cards/LinkCard.scss"

const LinkCard = (props) => {
    if (!props.content.url) return null;
    if (props.content.description) return <LinkDisplay preview={props.content} />
    else {
        return (
            <LinkPreview url={props.content.url}
                render={
                    ({ loading, preview }) => {
                        if (!loading) {
                            props.typeAPI.saveContent(props.id, { url: props.content.url, ...preview })
                        }
                        return (
                            loading ? <div>Loading...</div>
                                : null
                        )
                    }
                }
            />
        )
    }
}

const LinkDisplay = React.memo(({ preview }) => {
    return (
        <div className="link-card">
            <img className="preview-image" height="100px" width="100px" src={preview.img} alt={preview.title} />
            <div className="text">
                <div className="title">
                    <img alt="link-title" src={require("../../../../assets/link-logo.svg")} />{preview.title}</div>
                <div className="description">{preview.description}</div>
                <div className="domain">{preview.domain}</div>
            </div>
        </div>
    )
})

export default React.memo(LinkCard);