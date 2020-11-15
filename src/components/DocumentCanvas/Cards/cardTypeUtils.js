import ReactPlayer from "react-player/lazy";
/**
 * This Function Detects Extenstion of given URL
 * @param {String} url URL Whose Extension is to be detect
 * @returns Returns Type If ReactPlayer can play then `VideoLink` OR Else `link`
 */
export const getTypeFromURL = (url) => {
    try {
        new URL(url);
        return ReactPlayer.canPlay(url) ? "VideoLink" : "link";
    }
    catch (_) {
        return "NoLink";
    }
}

/**
 * This Function Detects the type of File from predefined set i.e.
 * `["image", "video", "audio", "pdf"]`
 * @param {String} contentType contentType of file whose type is going to be detect.
 * @returns {String} `file` If nothing from predefined set . Also If it's video the Return `VideoFile` . 
 */
export const getTypeFromMetadata = (contentType) => {
    const fileType = contentType.split("/")[0];
    const fileSet = {
        image: "image",
        video: "VideoFile",
        audio: "audio",
    }
    return fileSet[fileType] || "file"
}

/**
 * This function throws metadata of provided links .
 * @param {String} link The Link WHose metadata is to be figured out
 * @param {Object} callback Gives callback of returned metadata
 */
export const getMetadataFromURL = (link, callback) => {
    const linkFetch = `https://noembed.com/embed?url=${link}&maxwidth=350&maxheight=350`;
    fetch(linkFetch)
        .then(function (response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            console.log("RES ", response)
            return response.json();
        })
        .then(function (data) {
            console.log("DATA ", data)
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}
export const resizeDimension = (height, width) => {
    const maxDimension = Math.max(height, width);
    const multiplier = maxDimension > 400 ? 400 / maxDimension : 1;
    return [Math.floor(height * multiplier), Math.floor(width * multiplier)]
}
/**
 * This Function Detects Dimension of Given File and Send data as Callback
 * @param {String} type Type of File
 * @param {Object} file File whose dimension is wanted
 * @param {Object} callback Data includes `height` & `width`
 */
export const detectDimension = (type, file, callback) => {
    switch (type) {
        case 'image':
            imageDimension(file, data => { callback(data) });
            break;
        case 'VideoFile':
            videoDimension(file, data => { callback(data) });
            break;
        default:
            break;
    }
}
const imageDimension = (file, callback) => {
    var reader = new FileReader();
    console.log("COMPARE ", reader)
    //Read the contents of Image File.
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        //Initiate the JavaScript Image object.
        var image = new Image();

        //Set the Base64 string return from FileReader as source.
        image.src = e.target.result;
        //Validate the File Height and Width.
        image.onload = function () {
            console.log("Uploaded image has valid Height and Width.", this.height, this.width);
            callback({ height: this.height, width: this.width })
        }
    }
}
const videoDimension = (file, callback) => {
    var video = document.createElement('video');
    video.onloadedmetadata = () => {
        callback({ height: video.videoHeight, width: video.videoWidth })
    };
    video.onerror = () => {
        alert("Error!");
    };
    video.src = URL.createObjectURL(file);
    video.remove();
}
