import throttle from "lodash.throttle"
import { servertime } from "../../services/firebase"

/**
     * Saves Cursor Position of Current User to Firebase
     */
function saveCursorPosition(x, y) {
    this.updateLastActive()
    this.projectRef.child("cursors").child(this.userID)
        .set({ x: x, y: y })
        .then(() => { })
        .catch(err => console.log("error sending cursor position to others", err))
}
/**
 * Updates Last Active Time of Current User of Current Project
 */
function updateLastActive() {
    this.projectRef &&
        this.projectRef.child("users").child(this.userID).child("lastUpdatedAt")
            .set(servertime)

}
/**
 * Saves the Change OF Content & updates to FIREBASE 
 */
function saveContent(id, newContent) {
    this.updateLastActive()
    this.projectRef.child("nodes").child(id).child("content")
        .set(newContent)
        .then(console.log("saved new content for", id))
        .catch(err => console.log("error saving new content for", id, err))
}

export var throttleFunction = {
    saveCursorPosition: throttle(saveCursorPosition, 100),
    updateLastActive: throttle(updateLastActive, 5000),
    saveContent: throttle(saveContent, 500)
}