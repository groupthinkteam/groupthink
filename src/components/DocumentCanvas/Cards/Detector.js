export const extensionDetector = (url) =>{
    const validURL = (str) => {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
    const onlineVideoExtension = 
    [
        "youtube","facebook","soundcloud",
        "vimeo","wistia","mixcloud","dailymotion","twitch"
    ];    
    if(validURL(url))
    {
        var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
        var domain = urlParts[0].split(".com")[0];
        if(onlineVideoExtension.indexOf(domain) !== -1)
        {
            return "VideoLink" 
        }
        else
        {
            return "link" 
        }
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