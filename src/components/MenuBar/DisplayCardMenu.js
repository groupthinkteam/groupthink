import React, { useState } from 'react';
import { resizeDimension } from '../DocumentCanvas/Cards/cardTypeUtils';
const DisplayCardMenu = ({ me, store }) => {
    if (me) {
        switch (me.type) {
            case 'text':
                return (<Toolbar store={store} />)
            case 'VideoLink':
                return (<LinksMenu me={me} store={store} id={store.currentActive} />)
            case 'link':
                return (<LinksMenu link me={me} store={store} id={store.currentActive} />)
            case 'image':
                return (<ImageMenu me={me} store={store} />)
            default:
                return null;
        }
    }
    return null;
}
const Toolbar = ({ store }) => {
    const [dropDown, setDropDown] = useState(false);
    if (store.textareaRef) {
        return (
            <>
                <img onClick={() => store.formatText('bold')} src={require("../../assets/card-menu/toolbar/bold.svg")} alt="Bold" />
                <img onClick={() => store.formatText('italic')} src={require("../../assets/card-menu/toolbar/italics.svg")} alt="Italic" />
                <img onClick={() => store.formatText('underline')} src={require("../../assets/card-menu/toolbar/underline.svg")} alt="Underline" />
                <div className="menu-toolbar">
                    <img className="head1"
                        onClick={() => store.formatText('head1')} src={require("../../assets/card-menu/toolbar/heading1.svg")}
                        alt="Heading1" />
                    <img className={dropDown ? "dropdown-arrow close" : "dropdown-arrow"}
                        onClick={() => { setDropDown(!dropDown) }}
                        src={require("../../assets/card-menu/dropdown-arrow.svg")} alt="Change Card"
                    />
                </div>
                {
                    dropDown ?
                        <div className="menu-toolbar dropdown-content">
                            <span className="head2" onClick={() => store.formatText('head2')} >Heading 2</span>
                            <span className="head3" onClick={() => store.formatText('head3')} >Heading 3</span>
                            <span className="head4" onClick={() => store.formatText('head4')} >Heading 4</span>
                        </div>
                        : null
                }
                <div className="menu-bar-separator" />
            </>
        )
    }
    else
        return null;
};
const LinksMenu = ({ link, me, store, id }) => {
    const resizeCard = () => {
        const cardSize = link ?
            { height: 112, width: 400 }
            : { height: me.content.displayHeight + 40, width: me.content.displayWidth + 20 }

        if (me?.cardShrinked) {
            store.addCardProperty(store.currentActive, { cardShrinked: null });
            store.resize(store.currentActive, cardSize);
        }
        else {
            store.addCardProperty(store.currentActive, { cardShrinked: true });
            store.resize(store.currentActive, { height: 50, width: 250 });
        }
    }
    return (
        <>
            <div className={"link-menu"} id={"link-menu-" + id} >
                {
                    me.cardShrinked ?
                        <img onClick={resizeCard} src={require("../../assets/card-menu/resize/shrinked.svg")} alt="Shrinked" />
                        :
                        <img onClick={resizeCard} src={require("../../assets/card-menu/resize/expand.svg")} alt="Expand" />
                }
                <img
                    onClick={() => { store.convertCardToBlank(store.currentActive, me.type); }}
                    src={require("../../assets/card-menu/change-card.svg")} alt="Change Card"
                />
            </div>
            <div className="menu-bar-separator" />
        </>
    )
}
const ImageMenu = ({ store, me }) => {
    const [resizeDropDown, setResizeDropDown] = useState(false);
    const id = store.currentActive;
    const imageHeight = me.content?.height;
    const imageWidth = me.content?.width;
    const dropDownOptions = {
        'Default Size': {
            label: 'Default Size',
            onClick: () => {
                store.resize(id, { height: me.content.displayHeight + 60, width: me.content.displayWidth + 25 });
                store.addCardProperty(id, { resized: null });
            }
        },
        'Resize to Small': {
            label: 'Resize to Small',
            onClick: () => {
                var [displayHeight, displayWidth] = resizeDimension(imageHeight, imageWidth, 200);
                store.resize(id, { height: displayHeight + 60, width: displayWidth + 25 });
                store.addCardProperty(id, { resized: 'Resize to Small' });
            }
        },
        'Resize to Medium': {
            label: 'Resize to Medium',
            onClick: () => {
                var [displayHeightd, displayWidthd] = resizeDimension(imageHeight, imageWidth, 600);
                store.resize(id, { height: displayHeightd + 60, width: displayWidthd + 25 });
                store.addCardProperty(id, { resized: "Resize to Medium" })
            }
        },
        'Resize to Large': {
            label: 'Resize to Large',
            onClick: () => {
                var [displayHeights, displayWidths] = resizeDimension(imageHeight, imageWidth, 800);
                store.resize(id, { height: displayHeights + 60, width: displayWidths + 25 });
                store.addCardProperty(id, { resized: "Resize to Large" });
            }
        },
    }
    return (
        <>
            <div data-tip="Resize Card" className={""} style={{ display: 'flex' }} id={"image-menu-" + store.currentActive}>
                {
                    resizeDropDown ?
                        <div className="dropdown-content">
                            {
                                Object.entries(dropDownOptions)
                                    .filter(([name, _]) => name !== me.resized)
                                    .map(([name, property]) => {
                                        if (name === 'Default Size') {
                                            if (me.resized) {
                                                return <span key={name} onClick={property.onClick} >{property.label}</span>
                                            }
                                            else return null
                                        }
                                        else {
                                            return <span key={name} onClick={property.onClick} >{property.label}</span>
                                        }
                                    })
                            }
                        </div>
                        : null
                }

                <div className="resize-info" onClick={() => { setResizeDropDown(!resizeDropDown) }}>
                    {
                        me.resized ? me.resized : 'Default Size'
                    }
                    <img className={resizeDropDown ? "dropdown-arrow close" : "dropdown-arrow"}
                        src={require("../../assets/card-menu/dropdown-arrow.svg")} alt="Change Card"
                    />
                </div>
                <img
                    onClick={() => { store.convertCardToBlank(store.currentActive, me.type); }}
                    src={require("../../assets/card-menu/change-card.svg")} alt="Change Card"
                />
            </div>
            <div className="menu-bar-separator" />
        </>
    )
}
export default DisplayCardMenu;