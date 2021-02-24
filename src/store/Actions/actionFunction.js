const { analytics , functions } = require("../../services/firebase");

function runAction(name, id, callback) {
    analytics.logEvent('action_performed');
    let card = this.cards[id]
    let addCard = this.addCard
    let saveContent = this.saveContent
    let projectId = this.projectID
    // let projectRef = this.projectRef
    // let requestDownload = this.requestDownload

    function summarize() {
        const API_KEY = "89A59B5393";
        fetch(`https://api.smmry.com/SM_API_KEY=${API_KEY}&SM_WITH_BREAK&SM_URL=${card.content.url}`)
            .then((response) => {
                response.json().then((json) => {
                    if (json.sm_api_error !== undefined) {
                        callback(false)
                    }
                    addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                        { height: 200, width: 400 },
                        id,
                        "text",
                        (newID) => {
                            let content = json.sm_api_content?.split("[BREAK]").map((line) => "- " + line)
                            saveContent(newID, { text: content.join(" ") })
                        })
                    console.log({
                        percentReduced: json.sm_api_content_reduced,
                        content: json.sm_api_content?.split("[BREAK]")
                    })
                    callback(true)
                })
            })
    }
    function getYtCaptions() {
        if (!card.content.metadata.url.includes("www.youtube.com")) {
            callback("error")
        }
        const urlParts = card.content.metadata.url.split('=')
        const vidId = urlParts[urlParts.length - 1]

        fetch(`https://video.google.com/timedtext?lang=en&v=${vidId}`)
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                var lines = data.getElementsByTagName('text')
                var fullCap = ""
                var lLength = lines.length
                for (var i = 0; i < lLength; i++) {
                    fullCap = fullCap + " " + lines[i].childNodes[0].nodeValue
                }
                fullCap = fullCap.replace(/\n/g, ' ').replaceAll('&#39;', "'")
                //copyLink(fullCap);
                addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                    { height: 200, width: 400 },
                    id,
                    "text",
                    (newID) => {
                        let content = fullCap?.split("[BREAK]").map((line) => line)
                        saveContent(newID, { text: content.join(" ") })
                    })
            })
            .then(() => callback(true))
            .catch(() => callback(false))
    }
    function convFile() {
        var convToPdf = functions.httpsCallable('fileConv')
        //let newCardKey = projectRef.child("nodes").push().key;
        //var tempPath = `root/${projectId}/${newCardKey}/`
        const customMetadata = card.content.metadata.customMetadata

        const data = {
            fullpath: card.content.metadata.fullPath,
            //outPath: tempPath,
            //fileName: card.content.metadata.name,
            outformat: "pdf",
            updateMetadata: {
                metadata: {
                    [Object.keys(customMetadata)[0]]: customMetadata[Object.keys(customMetadata)[0]],
                }
            }
        }
        convToPdf(data)
            .then((status) => {
                console.log(status)
                if (status.data !== 'finished' && status.data !== null) {
                    alert("File could not be converted")
                }
                // else {
                //     console.log(`Path: ${newCardKey}/${card.content.metadata.name}`)
                //     requestDownload(`${newCardKey}/${card.content.metadata.name}`, (url, metadata) => {
                //         console.log("reqDownData", url, metadata)
                //         addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                //             {
                //                 height: 50,
                //                 width: 250
                //             }, id
                //             ,
                //             "file",
                //             (newID) => {
                //                 saveContent(newID, {
                //                     url: url,
                //                     metadata: metadata
                //                 })
                //             })
                //     })
                //     console.log(`${tempPath}${card.content.metadata.name}`)
                //     storage().ref(`${tempPath}${card.content.metadata.name}`).delete()
                //         .then(() => console.log("deleted temp file"))
                //         .catch((e) => console.log("Deletion Error: ", e))
                // }
                callback(true)
            }).catch(() => callback(false))
    }
    function convertLinksToCitation(citestyle) {
        var fullText = []
        var convToCite = functions.httpsCallable('linkToCitationTest')
        fullText = card.content.text
        console.log("full text: ", fullText);
        var linksArr = linksFromText(fullText);
        if (linksArr.length === 0) {
            return callback(false)
        }
        const linksData = {
            projectId: projectId,
            cardId: id,
            link: linksArr,
            fullText: fullText,
            style: citestyle
        }
        console.log("links data: ", linksData)
        convToCite(linksData)
            .then((output) => {
                console.log("cite out: ", output)
                addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                    { height: 200, width: 400 },
                    id,
                    "text",
                    (newID) => {
                        saveContent(newID, { text: output.data })
                    })
                callback(true)
            })
            .catch(() => callback(false))
    }
    function linksFromText(stri) {
        const regexp = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
        const str = String(stri);
        var array = []
        if (str.match(regexp) !== null) {
            array = [...str.match(regexp)];
        }
        return array
    }
    function convertImageToBW() {
        const imageData = {
            fpath: card.content.metadata.fullPath,
            contentType: card.content.metadata.contentType,
            customMetadata: card.content.metadata.customMetadata
        }
        var convToBw = functions.httpsCallable('imageToBw')
        return convToBw(imageData).then(() => callback(true)).catch(() => callback(false))
    }
    if (name === "summarize") {
        summarize()
    }
    if (name === "getYtCaptions") {
        getYtCaptions()
    }
    if (name === "convFile") {
        convFile()
    }
    if (name === "convToApaCitation") {
        convertLinksToCitation("apa")
    }
    if (name === "convToHarCitation") {
        convertLinksToCitation("harvard1")
    }
    if (name === "convToVanCitation") {
        convertLinksToCitation("vancouver")
    }
    if (name === "convertImageToBW") {
        convertImageToBW()
    }
}
const action = {
    actionsList: {
        "summarize": {
            id: "summarize",
            title: "Summarize a link",
            description: "uses AI to create a summary of a webpage or PDF",
            types: ["link"],
            icon: require("../../assets/actions/icons/summarize.svg")
        },
        "getYtCaptions": {
            id: "getYtCaptions",
            title: "Extract subtitles from a Youtube video",
            description: "extracts available closed captions from a Youtube video",
            types: ["VideoLink"],
            icon: require("../../assets/actions/icons/getYtCaptions.svg")
        },
        "convFile": {
            id: "convFile",
            title: "Convert file to PDF",
            description: "converts your file to pdf format",
            types: ["file"],
            icon: require("../../assets/actions/icons/convFile.svg")
        },
        "convToApaCitation": {
            id: "convToApaCitation",
            title: "Generate APA style citations",
            description: "generates citations for all the research publication links in your text",
            types: ["text"],
            icon: require("../../assets/actions/icons/convertLinksToCitation.svg")
        },
        "convToHarCitation": {
            id: "convToHarCitation",
            title: "Generate Harvard style citations",
            description: "generates citations for all the research publication links in your text",
            types: ["text"],
            icon: require("../../assets/actions/icons/convertLinksToCitation.svg")
        },
        "convToVanCitation": {
            id: "convToVanCitation",
            title: "Generate Vancouver style citations",
            description: "generates citations for all the research publication links in your text",
            types: ["text"],
            icon: require("../../assets/actions/icons/convertLinksToCitation.svg")
        },
        "convertImageToBW": {
            id: "convertImageToBW",
            title: "Convert image to grayscale",
            description: "converts an image to grayscale",
            types: ["image"],
            icon: require("../../assets/actions/icons/convertImageToBW.svg")
        }
    },
    // actions UI
    actionsUI: {
        isSelectingCard: false,
        selectedAction: null,
    }
}
// project templates
function useTemplate(name, callback) {
    if (name === "classDash") {
        this.addNewProject(data => callback(data), name, this.templatesList[`${name}`].title)
    }
    if (name === "blank") {
        this.addNewProject(data => callback(data), name, this.templatesList[`${name}`].title)
    }
}
const templates = {
    templatesList: {
        "blank": {
            id: "blank",
            title: "Blank Project",
            description: "Start a blank project."
        },
        "classDash": {
            id: "classDash",
            title: "Class Dashboard",
            description: "Take notes, organize articles, make summaries and more with this template."
        },
        "tripPlanning": {
            id: "tripPlanning",
            title: "More templates coming soon!",
            description: "Tell us what you want to see by giving feedback."
        }
    },
    templatesUI: {
        selectedTemplate: null
    }
}
export {
    runAction,
    action,
    useTemplate,
    templates
}