/**
 * This Template Return the Properties of Given Type .
 * @param {String} type - the type of card which need to be return.
 * 
 * Every Card Type Has the Following properties:-
 * @property {String} `type` 
 * @property {{width: number, height: number}} `size` - Contains 2 property. Height and Width.
 * @property {String} `Content` - The Contant of card at initial Render.
 */
const cardTemplate = (type,size) =>
{
    const audioCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const onlineVideoCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const pdfCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const fileCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const linkCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const imageCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const offlineVideoCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const textCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    const blankCardTemplate = {
        type: type,
        size: size,
        content: {
            text: `This is a ${type} Card`
        }
    }
    switch (type) {
        case "text":
            return textCardTemplate;
        case "VideoLink":
            return onlineVideoCardTemplate;
        case "VideoFile":
            return offlineVideoCardTemplate;
        case "image":
            return imageCardTemplate;
        case "audio":
            return audioCardTemplate;
        case "link":
            return linkCardTemplate;
        case "pdf":
            return pdfCardTemplate;
        case "file":
            return fileCardTemplate;
        default:
            return blankCardTemplate;
    }



}
export default cardTemplate;