//Note: - Height with should be in px if wanted then convert through parseInt() where ever using 
const cardSizeConstant = {
    'blank': {
        minWidth: "275px", 
        minHeight: "45px",
    },
    text: {
        minHeight: '40px',
        minWidth: '80px',
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
        minHeight: "50px",
        minWidth: "200px"
    },
    'VideoLink': {
        minWidth: "200px",
        minHeight: "50px"
    },
    VideoFile :{
        minWidth: "300px",
        minHeight: "200px"
    },
    image:{
        minWidth: "100px",
        minHeight: "100px",
        maxHeight: '1080px',
        maxWidth:'1280px'
    }
}
export default cardSizeConstant;