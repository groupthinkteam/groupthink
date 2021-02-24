/**
     * Adds New Card to Current Project
     * - Initially Setup card as Blank Card
     * @param {Object} position - Position Of Card 
     * @param {Object} size - Size Of Card
     * @param {String} newparent - New Parent (By Default it's root)
     * @param {String} newtype - Add New Type (By default it's blank)
     * @param {Function} getIDCallback - Callback to Get Card ID Generated
     * @param {String} optionalID - This ID is used While Duplicating card such to make new Card along it's original
     * 
     * @example 
     * addCard(
        * {x:x,y:y}, //Position
        * {width:10,heigth:20}, //Size In Number
        * 'root', //New Parent
        * 'image', //New Type 
        * id=>console.log("GENERATED CARD ID ",id) , //Console new Card ID
        * 'Orignal Card ID' 
     * ) 
     */
function addCard(position, size, newparent, newtype, getIDCallback, optionalID) {
    // schema for new card
    let parent = newparent || "root"
    let type = newtype || "blank"
    const newCard = {
        type: type,
        size: size,
        position: position,
        content: {
            text: ""
        },
        parent: parent
    }

    // create new key for child in ".../nodes"
    let newCardKey = optionalID || this.projectRef.child("nodes").push().key;

    // use that key to 
    // a) push the new card schema 
    // b) update the "children" property of parent
    let updates = {};
    updates[parent + "/children/" + newCardKey] = 1;
    updates[newCardKey] = newCard;
    this.projectRef.child("nodes").update(updates)
        .then(() => {
            console.log("Added a new child", newCardKey, "under", parent, "with position ", position)
            if (getIDCallback)
                getIDCallback(newCardKey)
        });
    this.updateLastActive()
}
/**
 * Deletes Card & Instance from FIREBASE with Strategy :
 * - In Recursive strategy Deletes Current card along with it's children and sub-children 
 * - In Reparent Strategy Deletes Current Card And Reparent it's to the Deleted Card Parent
 * @param {String} id - ID of card
 * @param {String} strategy - 'Recursive' or 'Reparent'
 * @param {String} newParent - newParent for children
 */
function removeCard(id, strategy, newParent) {
    this.updateLastActive();
    const updates = {};
    updates[id] = null;
    updates[this.cards[id]["parent"] + "/children/" + id] = null;
    if (this.cards[id]?.duplicate) {
        updates[this.cards[id]?.duplicate + "/originalOf"] = null;
    }
    /**
     * do a depth-first traversal of the subtree rooted at `id` and add
     * every element to updates{} for removal
     * @param {Array} stack 
     */
    const depthFirstTraversal = (stack) => {
        while (stack.length > 0) {
            let poppedID = stack.pop();
            updates[poppedID] = null;
            if (this.cards[poppedID]["children"])
                stack.concat(Object.keys(this.cards[poppedID]["children"]))
        }
    }
    if (this.cards[id]?.children)
        switch (strategy) {
            case "recursive":
                console.log("RECURSIVE ", this.cards[id]["children"])
                depthFirstTraversal(Object.keys(this.cards[id]["children"]));
                break;
            case "reparent":
                Object.keys(this.cards[id]["children"])
                    .forEach(child => {
                        updates[newParent + "/children/" + child] = 1
                        updates[child + "/parent"] = newParent
                    });
                break;
            default:
                break;
        }
    this.projectRef.child("nodes").update(updates)
        .then(console.log("deleted", id, "successfully")).catch(error => console.log("couldn't reparent because ", error));
}
export { addCard , removeCard}