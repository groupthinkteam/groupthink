import ReactPlayer from "react-player/lazy";
/**
 * This Function Detects Extenstion of given URL
 * @param {String} url URL Whose Extension is to be detect
 * @returns Returns Type If ReactPlayer can play then `VideoLink` OR Else `link`
 */
export const extensionDetector = (url) =>{
    const validURL = (str) => {
        try {
            new URL(str);
        } 
        catch (_) {
            return false;  
        }
        return true;
    }   
    if(validURL(url))
    {
        let resultType = 'link'
        if(ReactPlayer.canPlay(url))
           resultType = "VideoLink";
        console.log("Detector Extention Type After Loop",resultType )
        return resultType
    }
    else
    return "NoLink" 
    
}
/**
 * This Function Detects the type of File from predefined set i.e.
 * `["image", "video", "audio", "pdf"]`
 * @param {String} contentType contentType of file whose type is going to be detect.
 * @returns {String} `file` If nothing from predefined set . Also If it's video the Return `VideoFile` . 
 */
export const typeDetector = (contentType) => {
    const fileSet = ["image", "video", "audio", "pdf"]
    let demoType = 'file';
    const fileType = contentType.split("/");
    console.log(fileType, fileType.length)
    for (let i = fileType.length - 1; i >= 0; i--) {
        if (fileSet.indexOf(fileType[i]) !== -1) {
            demoType = fileType[i]
        }
        else continue;
    }
    console.log(contentType, demoType)
    if (demoType === 'video')
        return 'VideoFile';
    else
        return demoType;
}

/**
 * This function throws metadata of provided links .
 * @param {String} link The Link WHose metadata is to be figured out
 * @param {Object} callback Gives callback of returned metadata
 */
export const metadataOfLinks = (link,callback)=>{
    const linkFetch=`https://noembed.com/embed?url=${link}&maxwidth=350&maxheight=350`;
    fetch(linkFetch)
    .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        console.log("RES ",response)
        return response.json();
    })
    .then(function(data) {
        console.log("DATA ",data)
        callback(data);
    })
    .catch(error => {
        console.error(error);
    });
    
    
}
/**
 * This Function Detects Dimension of Given File and Send data as Callback
 * @param {String} type Type of File
 * @param {Object} file File whose dimension is wanted
 * @param {Object} callback Data includes `height` & `width`
 */
export const detectDimension =(type,file,callback)=>{
    switch(type)
    {
        case 'image':
            imageDimension(file,data=>{callback(data)});
            break;
        case 'VideoFile':
            videoDimension(file,data=>{callback(data)});
            break;
        default :
            break;
    }
}
const imageDimension = (file,callback)=>{
    var reader = new FileReader();
    console.log("COMPARE ",reader)
    //Read the contents of Image File.
    reader.readAsDataURL(file);
    reader.onload = function (e) 
    {
        //Initiate the JavaScript Image object.
        var image = new Image();
            
        //Set the Base64 string return from FileReader as source.
        image.src = e.target.result;
        console.log("COMPARE ",e);
        //Validate the File Height and Width.
        image.onload = function () {
            var height = this.height;
            var width = this.width;
            const aspectRatio= height/width;
            console.log("Uploaded image has valid Height and Width.",height , width);
            callback({height:height , width:width , aspectRatio:aspectRatio})
        }
    }                  
}
const videoDimension = (file,callback)=>{
    var video = document.createElement('video');
    video.onloadedmetadata = () => {
        console.log("Video loaded!");
        console.log("width: " + video.videoWidth + "\n height: " + video.videoHeight);
        const imageHeight = video.videoHeight;
        const imageWidth = video.videoWidth;
        callback( {height:imageHeight , width:imageWidth})
    };
    video.onerror = () => {
        alert ("Error!");
    };
    video.src = URL.createObjectURL(file);
    video.remove();
}
