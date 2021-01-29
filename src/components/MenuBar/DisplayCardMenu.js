import React from 'react'; 
import { resizeDimension } from '../DocumentCanvas/Cards/cardTypeUtils';
const DisplayCardMenu = ({me , store}) =>{
    if (me) {
        switch (me.type) {
            case 'text':
                return (<Toolbar store={store} />)
            case 'VideoLink':
                return (<LinksMenu me={me} store={store} id={store.currentActive}/>)
            case 'link':
                return (<LinksMenu link me={me} store={store} id={store.currentActive}/>)
            case 'image':
                return (<ImageMenu me={me} store={store}/>)
            default:
                return null;
        }
    }
    return null;
}
const Toolbar = ({store}) => {
    if (store.textareaRef) {
        return (
            <>
                <div data-tip="Change Text Format" className={"toolbar"} id={"toolbar-" + store.currentActive}>
                    <button className="toolbar-button" onClick={() => store.formatText('bold')}>bold</button>
                    <button className="toolbar-button" onClick={() => store.formatText('italic')}>Italic</button>
                    <button className="toolbar-button" onClick={() => store.formatText('head')}>head1</button>
                    <button className="toolbar-button" onClick={() => store.formatText('underline')}>underline</button>
                </div>
                <div className="menu-bar-separator" />
            </>
        )
    }
    else
        return null;
};
const LinksMenu = ({ link  , me , store , id}) => {
    return (
        <>
            <div className={"toolbar"} id={"toolbar" + id}>
                <button data-tip="Resize Card" className="toolbar-button" onClick={() => {
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
                }}>
                    {me?.cardShrinked ? "Expand" : "Shrink"}
                </button>
                <button className="toolbar-button"
                data-tip="Edit Link"
                    onClick={() => {
                        store.convertCardToBlank(store.currentActive, me.type);
                    }}
                >
                    Change Link
                </button>
            </div>
            <div className="menu-bar-separator" />
        </>
    )
}
const ImageMenu = ({store,me}) => { 
    const id = store.currentActive;
    const imageHeight = me.content?.height;
    const imageWidth = me.content?.width;
    return (
        <>
            <div data-tip="Resize Card" className={"toolbar"} style={{display:'contents'}} id={"toolbar" + store.currentActive}>
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
            </div>
            <div className="menu-bar-separator" />
        </>
    )
}
export default DisplayCardMenu;