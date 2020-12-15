
/**
 * @todo add more templates!
 */
const projectTemplates = {
    blank:{
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
    },
    classDash:{
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
}
export default projectTemplates;

    
