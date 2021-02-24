const { database , servertime } = require("../../services/firebase");

/**
     * This Function Adds New Property to Node on Firebase
     * @param {String} Id - Id of card / node
     * @param {Object} property - Property to be Add in Node
     */
function addCardProperty(Id, property) {
    this.projectRef.child("nodes").child(Id)
        .update(property)
        .then(() => {
            console.log(property, " Added to Card ID ", Id);
        })
        .catch(err => console.log("Error in Saving Card Color ", err));
}
/**
 * Saves Card Color to Firebase
 * @param {string} id - Id of Card
 * @param {String} hex - Color in HexaDecimal
 */
function saveCardColors(id, hex) {
    this.projectRef.child("nodes").child(id).child('color')
        .set(hex)
        .then(() => {
            console.log("Added ", hex, "COLOR to ", id)
        })
        .catch(err => console.log("Error in Saving Card Color ", err));
}

function getActionQuery(callback) {
    database.ref("actionsearch")
        .once('value').then(snap => { callback(snap.val()) })
        .catch(err => console.log("Error in GETACTION is: ", err));
}
/**
 * Checks Project Validity of Provided ID
 * @param {String} id - ID of Project
 * @param {Function} callback - Callback for validity status (T/F)
 */
function isProjectValid(id, callback) {
    this.userRef.once('value')
        .then(snap => { callback(snap.hasChild(id)) })
        .catch(error => console.log("While Validating Project", error));
}
/**
 * Saves Change in Position of Card to FIREBASE
 * @param {*} id - ID of card
 * @param {*} newPos - New Position Of Card
 */
function savePosition(id, newPos) {
    this.updateLastActive()
    let updates = {};
    if (newPos.x > this.container.width) {
        console.log("x", newPos.x, "was greater than width")
        updates["container/width"] = newPos.x + 300;
    }
    if (newPos.y > this.container.height) {
        console.log("y", newPos.y, "was greater than height")
        updates["container/height"] = newPos.y + 300;
    }
    updates["nodes/" + id + "/position/"] = newPos;
    this.projectRef.update(updates)
        .then(console.log("set new position for", id, "to", newPos));
}
/**
 * Updates New Size of Card to FIREBASE 
 * @param {String} id 
 * @param {Object} newSize 
 */
function resize(id, newSize) {
    this.updateLastActive()
    this.projectRef.child("nodes").child(id).child("size")
        .set(newSize)
        .then(console.log("set new size for", id, "to", newSize));
}
/**
 * Saves Updated Local Container Size to FIREBASE 
 */
function saveContainerSize() {
    this.updateLastActive()
    this.projectRef.child('container')
        .set(this.container)
        .then(console.log("set new size for container ", this.container.height, this.container.width));
}
/**
 * Saves the Change in Type of Given ID With it's new Type  
 * And Optionally Save Size & Content
 * @param {String} id 
 * @param {String} newType 
 * @param {Object} size 
 * @param {String | Object} content 
 */
function changeType(id, newType, size, content) {
    this.updateLastActive();
    const newCardDefaults = {
        type: newType,
        size: size,
        content: content,
    };
    this.projectRef.child("nodes").child(id)
        .update(newCardDefaults)
        .then(console.log("set", content, "new type for", id, "value:", newCardDefaults))
        .catch(err => err);
}

/**
 * Updates the FOLLOWING property in Given user ID from FIREBASE 
 * @param {String} userId 
 */
function addUserFollow(userId) {
    console.log("ADDED USER FOLLOW", userId)
    // this.users[userId] = {
    //     ...this.users[userId] ,following: this.userID
    // }
    this.projectRef.child("users").child(userId)
        .update({ following: this.userID })
        .then(console.log(this.userID, " User Following ", userId))
        .catch(reason => console.log("Couldn;t follow because ", reason));
}
/**
 * Removes the FOLLOWING property in Given user ID from FIREBASE 
 * @param {String} userId 
 */
function removeUserFollow(userId) {
    console.log("REMOVED USER FOLLOW", userId)
    // this.users[userId] = {
    //     ...this.users[userId] ,following: null
    // }
    this.projectRef.child("users").child(userId)
        .update({ following: null })
        .then(console.log(this.userID, " User Following ", userId))
        .catch(reason => console.log("Couldn;t follow because ", reason));
}
/**
 * Adds 'editing' Property to the given card id 
 * - Use to check which card is using by whom
 * - FIREBASE operation
 * @param {String} id 
 */
function addUserEditing(id) {
    this.projectRef.child('nodes').child(id).child("editing")
        .set({ [this.userID]: servertime })
        .then(console.log("this user is editing card", id))
        .catch(error => console.log("error raised in addUserEditing because ", error))
}
/**
 * Removes 'editing' Property to the given card id
 * @param {*} id 
 */
function removeUserEditing(id) {
    this.projectRef.child('nodes').child(id).child("editing").child(this.userID)
        .set(null)
        .then(console.log("This User is Now Not Editing"))
        .catch(error => console.log("Error raised in addUserEditing because ", error))
}
/**
 * Update 'joinedCall' Property in current User when Joined Call
 * @param {Object} info 
 */
function addUserCallInfo(info) {
    this.projectRef.child('users').child(this.userID)
        .update({ joinedCall: true }) //TODO: can add speaking Feature
        .then(console.log("This User has Joined Call"))
        .catch(error => console.log("Error raised in addUserCallInfo because ", error))
}
/**
 * Remove 'joinedCall' Property in current User when Call is Disconnected
 * @param {Object} info 
 */
function removeUserCallInfo(info) {
    this.projectRef.child('users').child(this.userID)
        .update({ joinedCall: null })
        .then(console.log("This User has Not Joined Call"))
        .catch(error => console.log("Error raised in removeUserCallInfo because ", error))
}
function generateTask() {
    let newCardKey = this.tasksRef.push().key;
    this.tasksRef.child(newCardKey)
        .set({
            height: 124,
            creator: this.userID,
            content: {
                // tag: [],
                task1: {
                    text: '',
                    status: 'initialized'
                }
            }
        })
        .then(() => console.log('Added Task'))
        .catch((err) => console.log("Could not created task because ", err));
}
function updateTask(taskID, userID, updates) {
    this.tasksRef.child(taskID)
        .update(updates)
        .then(() => console.log('Task Updated', updates))
        .catch((err) => console.log("Could not update task because ", err));
}
function removeTask(id) {
    this.tasksRef.child(id)
        .set(null)
        .then(console.log("Removed Task", id))
        .catch((err) => console.log("Didn't removed because", err))
}

export {
    addCardProperty,
    addUserCallInfo,
    addUserFollow,
    addUserEditing,
    removeTask,
    resize,
    removeUserCallInfo,
    removeUserEditing,
    removeUserFollow,
    updateTask,
    savePosition,
    saveContainerSize,
    saveCardColors,
    generateTask,
    changeType,
    getActionQuery,
    isProjectValid
}