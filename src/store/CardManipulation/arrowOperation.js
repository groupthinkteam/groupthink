const { analytics } = require("../../services/firebase");

/**
     * Makes ID of newParent to Child of Given card ID 
     * @param {String} id 
     * @param {String} newParent 
     * @param {*} strategy 
     */
function makeCardChild(id, newParent, strategy) {
    analytics.logEvent('card_child_added')
    this.updateLastActive()
    const updates = {};
    console.log("reparent requested for", id, "newparent", newParent);
    const throwParent = (ancestor) => { return this.cards[ancestor]?.parent }
    function checkValidity(ancestor) {
        if (ancestor === 'root') return true
        if (ancestor === newParent) return false
        const parent = throwParent(ancestor);
        return checkValidity(parent)
    }
    if (checkValidity(id)) {

        let currentParent = this.cards[newParent]["parent"];
        updates[newParent + "/parent"] = id;
        updates[currentParent + "/children/" + newParent] = null;
        updates[id + "/children/" + newParent] = 1;
        this.projectRef.child("nodes")
            .update(updates)
            .then(console.log(updates, "successfully changed the parent of", id, "from", currentParent, "to", newParent))
            .catch((reason) => console.log("error reparenting because", reason));
        return;
    }
    console.log("didn't reparent because it was just not a valid request. do better next time.")
}
/**
 * Reparents the Card of id with newParent
 * @param {String} id 
 * @param {String} newParent 
 * @param {*} strategy 
 */
function reparentCard(id, newParent, strategy) {
    this.updateLastActive();
    if (this.cardGrouped.length) {
        const indexOf = this.cardGrouped.indexOf(id);
        this.cardGrouped.splice(indexOf, 1);
    }
    const updates = {}
    let currentParent = this.cards[id]["parent"];
    updates[id + "/parent"] = newParent;
    updates[currentParent + "/children/" + id] = null;
    updates[newParent + "/children/" + id] = 1;
    this.projectRef.child("nodes")
        .update(updates)
        .then(console.log("successfully changed the parent of", id, "from", currentParent, "to", newParent))
        .catch((reason) => console.log("error reparenting because", reason));
    return;

}
export { makeCardChild , reparentCard}