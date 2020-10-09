import ReactPlayer from "react-player/lazy";

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
        return resultType;
    }
    else
    return "NoLink" 
    
}
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