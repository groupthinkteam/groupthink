/**
 * This Template Return the Properties of Given Type .
 * @param {String} type - the type of card which need to be return.
 * 
 * Every Card Type Has the Following properties:-
 * @property {String} `type` 
 * @property {{width: number, height: number}} `size` - Contains 2 property. Height and Width.
 * @property {String} `Content` - The Contant of card at initial Render.
 */
const cardTemplate = (type) =>
{
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

const audioCardTemplate = {
    type: 'audio',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a Audio Card`
    }
}
const onlineVideoCardTemplate = {
    type: 'VideoLink',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a Video Link  Card`
    }
}
const pdfCardTemplate = {
    type: 'pdf',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a pdf Card`
    }
}
const fileCardTemplate = {
    type: 'file',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a file Card`
    }
}
const linkCardTemplate = {
    type: 'link',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a link Card`
    }
}
const imageCardTemplate = {
    type: 'image',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a image Card`
    }
}
const offlineVideoCardTemplate = {
    type: 'VideoFile',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a VideoFile Card`
    }
}
const textCardTemplate = {
    type: 'text',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a text Card`
    }
}
const blankCardTemplate = {
    type: 'text',
    size: {
        height : 300,
        width : 400
    },
    content: {
        text: `This is a text Card`
    }
}

export default cardTemplate;