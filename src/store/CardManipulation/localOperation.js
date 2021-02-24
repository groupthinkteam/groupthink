import set from "lodash.set"
/**
     * Locally Saves Card Color
     * @param {String} hex - Color in HexaDecimal
     */
function addColorsToCards(hex) {
    this.cardGrouped.forEach(Id => {
        this.cards[Id]["color"] = hex
    })
}

/**
 * Adds Selected Card if Id to Recent Searches Array
 * @param {String} id 
 */
function addToRecentSearch(id) {
    console.log("Check recent search ID", id, this.projectID);
    const k = this.projectID
    this.recentSearches[id] = k;
    console.log("Check recent search ID", this.recentSearches);
    // if(this.recentSearches.indexOf(id) !== 0)
    // this.recentSearches.push(id);
}

/**
     * Locally saves Change in Position of Card
     * @param {*} id - ID of card
     * @param {*} newPos - New Position Of Card
     */
function changePosition(id, newPos) {
    this.cards[id]["position"] = newPos;
}
/**
 * Locally Save the change in size of Given Card ID
 * @param {String} id 
 * @param {Object} size 
 */
function changeSize(id, size) {
    console.log("triggered local size change on", id);
    this.cards[id]["size"] = size;
}
/**
 * Locally Updates Content of given cardID
 * @param {String} id 
 * @param {Object | String} newContent 
 */
function changeContent(id, newContent) {
    console.log("triggered local content change on", id);
    this.cards[id]["content"] = newContent;
    this.saveContent(id, newContent);
}
/**
     * Responsible For Selected Formating of Text in Text Card :
     * - Bold
     * - Italic
     * - Underline
     * - Head 1 , 2 , 3, 4
     * @param {String} event Name Of Event that has to be in the format
     */
function formatText(event) {
    console.log("event ", event)
    const store = this;
    let text = store.cards[store.currentActive].content.text;
    let start = store.textareaRef.current.selectionStart;
    let end = store.textareaRef.current.selectionEnd;
    console.log("TEXT ", text, "SELECTION", start, end);
    let newText;
    switch (event) {
        case 'bold':
            newText = text.substring(0, start) + '<b>' + text.substring(start, end) + '</b>' + text.substring(end, text.length);
            break;
        case 'head1':
            newText = text.substring(0, start) + " <h1> " + text.substring(start, text.length) + "</h1>";
            break;
        case 'head2':
            newText = text.substring(0, start) + " <h2> " + text.substring(start, text.length) + "</h2>";
            break;
        case 'head3':
            newText = text.substring(0, start) + " <h3> " + text.substring(start, text.length) + "</h3>";
            break;
        case 'head4':
            newText = text.substring(0, start) + " <h4> " + text.substring(start, text.length) + "</h4>";
            break;
        case "italic":
            newText = text.substring(0, start) + "<em> " + text.substring(start, end) + " </em> " + text.substring(end, text.length);
            break;
        case "underline":
            newText = text.substring(0, start) + " <u> " + text.substring(start, end) + " </u> " + text.substring(end, text.length);
            break;
        case 'colorRed':
            newText = text.substring(0, start) + ` <span style="color:red">` + text.substring(start, end) + "</span>" + text.substring(end, text.length);
            break;
        default: break;
    }
    console.log("NEW TEXT ", newText)
    store.changeContent(store.currentActive, { text: newText });
    store.textareaRef.current.focus();
    store.textareaRef.current.selectionEnd = end - 2;
}

/**
     * Locally Saves Change in Size of Container
     * @param {Object} size 
     */
function changeContainerSizeLocal(size) {
    this.container = size
}

/**
     * Groups All the Ancestor of Given CardID :
     * - Pushes Ancestor in an Array
     * - Local Operation
     * @param {String} id 
     */
function groupCardsParent(id) {
    const currentCard = this.cards[id];
    if (currentCard.parent !== 'root') {
        this.cardGrouped.push(currentCard.parent);
        this.groupCardsParent(currentCard.parent);
    }
}
/**
 * Groups All the Childrens of Given CardID :
 * - Pushes Childrens in an Array
 * - Local Operation
 * @param {String} id 
 */
function groupCardsChildren(id) {
    const currentCard = this.cards[id];
    if (currentCard?.children) {
        Object.keys(currentCard.children)
            .forEach(id => {
                this.cardGrouped.push(id);
                this.groupCardsChildren(id);
            })
    }
}
/**
     * Locally Adds 'isCollapse' Property to given card id
     * @param {String} id 
     * @param {String} strategy - for Main Card to show as Collapsed Card
     */
function collapseCard(id, strategy) {
    strategy ? this.collapsedID[id] = strategy : this.cards[id]["isCollapse"] = true;
}
/**
 * Locally removes 'isCollapse' Property to given card id
 * @param {String} id 
 * @param {String} strategy - for Main Card to show as Expanded Card
 */
function expandCard(id, strategy) {
    strategy ? this.collapsedID[id] = null : this.cards[id]["isCollapse"] = null;
}
// update any property of store (for use with listeners)
function sync(property, path, value) {
    set(this[property], path, value)
}
/**
 * Sets Highlight Property to Searched Item results
 * @param {*} result - Search Result
 * @param {*} belongsTo 
 */
function highlightSearched(result, belongsTo) {
    if (belongsTo === 'projects' && result.length > 0)
        Object.entries(result).forEach(([_, val]) => {
            this.projects[val.id].highlight = true;
        })
}
export {
    addColorsToCards,
    addToRecentSearch,
    changePosition,
    changeSize,
    changeContent,
    formatText,
    changeContainerSizeLocal,
    groupCardsParent,
    groupCardsChildren,
    collapseCard,
    expandCard,
    sync,
    highlightSearched
}