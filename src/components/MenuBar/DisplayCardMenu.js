import React from 'react';
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
                return null;
                // return (<ImageMenu me={me} store={store} />)
            default:
                return null;
        }
    }
    return null;
}
const Toolbar = ({ store }) => {
    if (store.textareaRef) {
        return (
            <>
                <img onClick={() => store.formatText('bold')} src={require("../../assets/card-menu/toolbar/bold.svg")} alt="Bold" />
                <img onClick={() => store.formatText('italic')} src={require("../../assets/card-menu/toolbar/italics.svg")} alt="Italic" />
                <img onClick={() => store.formatText('underline')} src={require("../../assets/card-menu/toolbar/underline.svg")} alt="Underline" />
                <img onClick={() => store.formatText('head')} src={require("../../assets/card-menu/toolbar/heading1.svg")} alt="Heading1" style={{ marginLeft: '8px' }} />
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
    const id = store.currentActive;
    const imageHeight = me.content?.height;
    const imageWidth = me.content?.width;
    return (
        <>
            <div data-tip="Resize Card" className={""} style={{ display: 'flex' }} id={"image-menu-" + store.currentActive}>
                {
                    me?.resized ?
                        <button
                            onClick={() => {
                                store.resize(id, { height: me.content.displayHeight + 60, width: me.content.displayWidth + 25 });
                                store.addCardProperty(id, { resized: null });
                            }}
                        >
                            Default Size
                        </button>
                        : null
                }

                <button
                    onClick={() => {
                        var [displayHeight, displayWidth] = resizeDimension(imageHeight, imageWidth, 200);
                        store.resize(id, { height: displayHeight + 60, width: displayWidth + 25 });
                        store.addCardProperty(id, { resized: 'Resize to Small' });
                    }}
                >
                    Resize to Small
                </button>
                <button
                    onClick={() => {
                        var [displayHeightd, displayWidthd] = resizeDimension(imageHeight, imageWidth, 600);
                        store.resize(id, { height: displayHeightd + 60, width: displayWidthd + 25 });
                        store.addCardProperty(id, { resized: "Resize to Medium" })
                    }}
                >
                    Resize to Medium
                </button>
                <button
                    onClick={() => {
                        var [displayHeights, displayWidths] = resizeDimension(imageHeight, imageWidth, 800);
                        store.resize(id, { height: displayHeights + 60, width: displayWidths + 25 });
                        store.addCardProperty(id, { resized: "Resize to Large" });
                    }}
                >
                    Resize to Large
                </button>
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