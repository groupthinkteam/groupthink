import MiniSearch from 'minisearch';

export default class SearchElements {

    constructor(indexes) {
        this.miniSearch = new MiniSearch({
            fields: indexes,
            searchOptions: {
                fuzzy: 0.01,
                prefix: true
            }
        });
        this.serializedActionIndex = '{ "index": { "_tree": { "b": { "lack": { "": { "0": { "df": 1, "ds": { "0": 1 } } } }, "": { "0": { "df": 1, "ds": { "0": 1 } } } }, "w": { "hite": { "": { "0": { "df": 1, "ds": { "0": 1 } } } }, "": { "0": { "df": 1, "ds": { "0": 1 } } } }, "grayscale": { "": { "0": { "df": 1, "ds": { "0": 1 } } } }, "monochrome": { "": { "0": { "df": 1, "ds": { "0": 1 } } } }, "publication": { "": { "0": { "df": 1, "ds": { "1": 1 } } } }, "research": { "": { "0": { "df": 1, "ds": { "1": 1 } } } }, "c": { "itation": { "": { "0": { "df": 1, "ds": { "1": 1 } } } }, "onvert": { "": { "0": { "df": 1, "ds": { "1": 1 } } } } }, "ieee": { "": { "0": { "df": 1, "ds": { "1": 1 } } } }, "a": { "nd": { "": { "0": { "df": 1, "ds": { "0": 1 } } } }, "pa": { "": { "0": { "df": 1, "ds": { "1": 1 } } } }, "rticle": { "": { "0": { "df": 1, "ds": { "1": 1 } } } } } }, "_prefix": "" }, "documentCount": 2, "nextId": 2, "documentIds": { "0": 1, "1": 2 }, "fieldIds": { "searchQuery": 0 }, "fieldLength": { "0": { "0": 7 }, "1": { "0": 7 } }, "averageFieldLength": { "0": 7 }, "storedFields": {} }'
        this.actionSearch = new MiniSearch.loadJSON(this.serializedActionIndex, {
            fields: ['searchQuery'], searchOptions: {
                fuzzy: 0.2,
                prefix: true
            },
            storeFields: ['actionName']

        });
    }
    getActionSearchResult(text) {
        return [this.actionSearch.search(text), this.actionSearch.autoSuggest(text)]
    }
    getResult(text, elementToBeSearchIn) {
        const projectArray = [];
        Object.entries(elementToBeSearchIn).map(([key, val]) => {
            if (key !== "root")
                switch (val.type) {
                    case "text":
                        if (val.content.title) projectArray.push({ id: key, title: val.content.title });
                        projectArray.push({ id: key, text: val.content.text});//.replace(/<[^>]+>/g, ' ').replace(/^\s+|\s+$/g, '').split(/\s+/) });
                        break;
                    case "todo":
                        projectArray.push({ id: key, title: val.content.title })
                        Object.entries(val.content.items).map(([keys, values]) => {
                            if (keys !== "root")
                                projectArray.push({ id: key, text: values.text })
                            return '';
                        });
                        break;
                    case "link":
                        projectArray.push({ id: key, url: val.content.url });
                        break;
                    case "image":

                        projectArray.push({ id: key, fileName: val.content.metadata?.name })
                        projectArray.push({ id: key, extention: val.content.metadata?.contentType });
                        projectArray.push({ id: key, description: val.content.label?.description });
                        projectArray.push({ id: key, captions: val.content.caption });

                        break;
                    case "audio":
                        projectArray.push({ id: key, fileName: val.content.metadata?.name })
                        projectArray.push({ id: key, extention: val.content.metadata?.contentType });

                        break;
                    case "VideoFile":
                        projectArray.push({ id: key, fileName: val.content.metadata?.name })
                        projectArray.push({ id: key, extention: val.content.metadata?.contentType });

                        break;
                    case 'file':
                        projectArray.push({ id: key, fileName: val.content.metadata?.name })
                        projectArray.push({ id: key, extention: val.content.metadata?.contentType });

                        break;
                    case 'VideoLink':
                        projectArray.push({ id: key, author_name: val.content.metadata.author_name });
                        projectArray.push({ id: key, author_url: val.content.metadata.author_url });
                        projectArray.push({ id: key, title: val.content.metadata.title });
                        break;
                    case "blank":
                        projectArray.push({ id: key, text: val.content.text });
                        break;
                    default:
                        //This is For Search in Cards Other than documents/projectID/nodes/
                        projectArray.push({ id: key, name: val.metadata?.name })
                        break;
                }
            return '';
        })
        if (projectArray.length > 0)
            this.miniSearch.addAll(projectArray)

        const results = this.miniSearch.search(text);
        const suggestions = this.miniSearch.autoSuggest(text);

        return [results, suggestions];
    }
}