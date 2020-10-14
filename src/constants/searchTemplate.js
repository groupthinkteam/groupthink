import MiniSearch from 'minisearch';

export const searchElementinDocuments = (text , elementToBeSearchIn) =>{
    const makeArrayofProject = [] ;
    let miniSearch = new MiniSearch({
        fields : ['content.text' , 'fileName' ,  'title' , 'content.url'],
        extractField: (document, fieldName) => {
            // Access nested fields
            return fieldName.split('.').reduce((doc, key) => doc && doc[key], document)
        }
    });
    
    Object.entries(elementToBeSearchIn).map(([key,val])=>{
        if(key!="root")
        switch(val.type){
            case "text" :
                makeArrayofProject.push({id:key,content:val.content});
                break;
            case "todo" :
                makeArrayofProject.push({id:key,title:val.content.title})
                Object.entries(val.content.items).map(([keys,values])=>{
                    if(keys!="root")
                    makeArrayofProject.push({id:key,content:values , subID : keys})
                });
                break;
            case "link" :
                makeArrayofProject.push({id:key,content:val.content});
                break;
            case "pdf":
                Object.entries(val.content).map(([[subkey , subvalues],values])=>{
                     console.log("SUBKEY SUBVALUES ",subkey,subvalues,values)
                    makeArrayofProject.push({id:key,fileName:values.metadata?.name.split(">")[0]})
                });
                break;
            case "audio":
                Object.entries(val.content).map(([[subkey , subvalues],values])=>{
                    makeArrayofProject.push({id:key,fileName:values.metadata?.name.split(">")[0]})
                });
                break;
            case "VideoFile":
                Object.entries(val.content).map(([[subkey , subvalues],values])=>{
                    makeArrayofProject.push({id:key,fileName:values.metadata?.name.split(">")[0]})
                });
                break;
            case 'file':
                Object.entries(val.content).map(([[subkey , subvalues],values])=>{
                    makeArrayofProject.push({id:key,fileName:values.metadata?.name.split(">")[0]})
                });
                break;
            case 'VideoLink':
                Object.entries(val.content).map(([[subkey , subvalues],values])=>{
                    makeArrayofProject.push({id:key,fileName:values.metadata?.name.split(">")[0]})
                });
                break;
            case "blank":
                makeArrayofProject.push({id:key,content:val.content});
                break;
            default :
                break;    
        }
        
    })
    if(makeArrayofProject.length > 0 )
     miniSearch.addAll(makeArrayofProject)

    const results = miniSearch.search(text, { fuzzy: 0.2 });
    
    console.log("THE SEARCH ELEMENTS ",results , text,makeArrayofProject);
    return results;
}