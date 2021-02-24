const { functions, database, servertime } = require("../../services/firebase")

/**
 * Invite Provided data of Email and Send Invitation through link
 * @param {*} data 
 */
function sendInviteEmail(data) {
    var sendLinkEmail = functions.httpsCallable('sendLinkEmail')
    return sendLinkEmail(data)
}
/**
 * Generates Key For Sharing Project on Basis of permission in FIREBASE
 * @param {*} permission 
 */
function addKeyToShare(permission) {
    const newSharedKey = this.projectRef.child("sharing").push().key;
    let updates = {};
    updates[newSharedKey] = permission;
    this.projectRef.child("sharing")
        .update(updates)
        .then(console.log("successfully Added key ", newSharedKey))
        .catch((reason) => console.log("error in updating key because", reason));
    console.log("keys ", this.projectRef.child("sharing").once('value').then((snapshot) => snapshot.val()))
    return (newSharedKey);
}
/**
 * Checks Whether Keys For Sharing is present or not
 * @returns {Boolean} If Key Exists
 */
function checkKeys() {
    const check = this.projectRef.child("sharing").once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                return true;
            }
        })
        .catch((err) => err)
    return check;
}
/**
 * Fetches the Key Generated at time of Sharing project
 */
function fetchKeys() {
    const keys = this.projectRef.child("sharing").once('value')
        .then((snapshot) => {
            return snapshot.val()
        })
        .catch((err) => console.log(err))
    return keys
}
/**
 * Remove Current User Sharing Property from project 
 * @returns {Boolean}
 */
function removeKey() {
    const keys = this.projectRef.child("sharing").remove()
        .then(() => {
            console.log("Removed")
        })
        .catch((err) => console.log(err))
    return keys
}
/**
 * Creates the Project Base with Permission associated to it.
 * By the verification of KeyID that was generated at time of Sharing 
 * @param {String} projectID 
 * @param {String} keyId 
 * @param {String} permission 
 * @param {Function} callback 
 */
function createSharedUser(projectID, keyId, permission, callback) {
    let updates = {};
    updates[this.userID] = {
        "permission": permission,
        "access": keyId,
        "email": this.currentUser.email,
        "photoURL": this.currentUser.photoURL,
        "name": this.currentUser.displayName,
    }
    console.log("shared user was called, payload is", updates, this.currentUser.uid)
    database.ref("documents").child(projectID).child("users")
        .update(updates)
        .then(() => {
            this.projectID = projectID
            console.log("added new user to document")
            database.ref("documents").child(projectID).child("metadata")
                .once('value')
                .then((snap) => {
                    console.log("retrived metadata from document")
                    let projectMetadata = snap.val();
                    this.userRef.child(projectID).set({
                        access: permission,
                        name: projectMetadata.name,
                        thumbnailURL: projectMetadata.thumbnailURL,
                        createdAt: servertime,
                        shared: true
                    }).then(() => {
                        console.log("updated user's profile with new document");
                        callback(true)
                    })
                        .catch(err => console.log("error updating user's profile with new document", err));
                })
        }).catch((error) => { console.log("failed to update because", error); callback(false) });
}
export {
    sendInviteEmail,
    addKeyToShare,
    checkKeys,
    fetchKeys,
    removeKey,
    createSharedUser
}