
/**
 * @todo add more templates!
 */
const blank = {

    container: {
        height: "10000px",
        width: "10000px"
    },
    nodes: {
        root: {
            children: {
                "dummy": 1
            }
        }
    }

}
const classDash = {

    container: {
        height: "10000px",
        width: "10000px"
    },
    nodes: {
        'tempTextCard': {
            content: {
                text: '<p>s</p>'
            },
            type:'text',
            size:{
                width:280,
                height:200
            },
            position:{
                x:window.innerWidth/2,
                y: 40
            }
        },
        root: {
            children: {
                "dummy": 1
            }
        }
    }

}
const projectTemplates = (tempID) => {
    switch(tempID)
    {
        case 'blank':
            return blank;
        case 'classDash':
            return classDash;
        default : break;
    }
}
export default projectTemplates;

    
