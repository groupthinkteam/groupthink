//Note: - Height with should be in px if wanted then convert through parseInt() where ever using 
const cardSizeConstant = {
    'blank': {
        minWidth: "275px", 
        minHeight: "45px",
    },
    text: {
        minHeight: '200px',
        minWidth: '280px',
        maxHeight: '600px',
        maxWidth:'600px'
    },
    todo: {
        minHeight: "300px",
        minWidth: "230px"
    },
    file: {
        minHeight: "60px",
        minWidth: "200px"
    },
    audio: {
        minHeight: "113px",
        minWidth: "300px"
    },
    link: {
        minHeight: "112px",
        minWidth: "400px"
    },
    'VideoLink': {
        minWidth: "300px",
        minHeight: "200px"
    },
    VideoFile :{
        minWidth: "300px",
        minHeight: "200px"
    },
    image:{
        minWidth: "100px",
        minHeight: "100px",
        maxHeight: '800px',
        maxWidth:'800px'
    }
}
export default cardSizeConstant;