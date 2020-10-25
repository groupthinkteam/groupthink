import MiniSearch from 'minisearch';
/**
 * This File Searches the text from the given element from which is need to be serched
 * @param {String} text - The text that has to be searched
 * @param {Object} elementToBeSearchIn  - The Object/ Element from which it needs to be searched
 * @param {Array} indexes - The index on basis of which search is done.
 * @returns {Array} - Searched Outcomes
 * 
 * Note:- for any new index to search then it will be under content
 * @example 
 * //CASE 1 :
 * elementoBeSearch = {
 * {
 *  id : 1
 *  name : 'XYZ' 
 * }
 * //Need to find name then 
 * indexes = [content.name] //indexes should be like this
 * 
 * //CASE 2 : For Nested 
 * {
 *  id:1
 *  author : {name : 'XYZ' }
 * }
 * //Need to find name then 
 * indexes = [content.author.name] //indexes should be like this
 */
export const searchElementinDocuments = (text, elementToBeSearchIn, indexes) => {
    const makeArrayofProject = [];
    let miniSearch = new MiniSearch({
        fields: indexes,
        extractField: (document, fieldName) => {
            // Access nested fields
            return fieldName.split('.').reduce((doc, key) => doc && doc[key], document)
        }
    });

    // card manager -> minisearch import
    // create minisearch index

    Object.entries(elementToBeSearchIn).map(([key, val]) => {
        if (key !== "root")
            switch (val.type) {
                case "text":
                    makeArrayofProject.push({ id: key, content: val.content });
                    break;
                case "todo":
                    makeArrayofProject.push({ id: key, title: val.content.title })
                    Object.entries(val.content.items).map(([keys, values]) => {
                        if (keys !== "root")
                            makeArrayofProject.push({ id: key, content: values, subID: keys })
                            return '';
                    });
                    break;
                case "link":
                    makeArrayofProject.push({ id: key, content: val.content });
                    break;
                case "pdf":
                    Object.entries(val.content).map(([[_, __], values]) => {
                        console.log("_ __ ", _, __, values)
                        makeArrayofProject.push({ id: key, fileName: values.metadata?.name.split(">")[0] })
                        return '';
                    });
                    break;
                case "audio":
                    Object.entries(val.content).map(([[_, __], values]) => {
                        makeArrayofProject.push({ id: key, fileName: values.metadata?.name.split(">")[0] })
                        return '';
                    });
                    break;
                case "VideoFile":
                    Object.entries(val.content).map(([[_, __], values]) => {
                        makeArrayofProject.push({ id: key, fileName: values.metadata?.name.split(">")[0] })
                        return '';
                    });
                    break;
                case 'file':
                    Object.entries(val.content).map(([[_, __], values]) => {
                        makeArrayofProject.push({ id: key, fileName: values.metadata?.name.split(">")[0] })
                        return '';
                    });
                    break;
                case 'VideoLink':
                    Object.entries(val.content).map(([[_, __], values]) => {
                        makeArrayofProject.push({ id: key, fileName: values.metadata?.name.split(">")[0] })
                        return '';
                    });
                    break;
                case "blank":
                    makeArrayofProject.push({ id: key, content: val.content });
                    break;
                default:
                    //This is For Search in Cards Other than documents/projectID/nodes/
                    makeArrayofProject.push({ id: key, content: val })
                    break;
            }
            return '';    
    })
    if (makeArrayofProject.length > 0)
        miniSearch.addAll(makeArrayofProject)

    const results = miniSearch.search(text, { fuzzy: 0.2 });

    console.log("THE SEARCH ELEMENTS ", results, text, makeArrayofProject);
    return results;
}