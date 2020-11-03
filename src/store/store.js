import set from "lodash.set"
import throttle from "lodash.throttle"
import { database, storage, auth, servertime } from "../services/firebase"
import projectTemplates from "../constants/projectTemplates"
import "mobx-react-lite"
import { FIREBASE_CONSTANTS } from "../constants/firebaseConstants"

export var storeObject = {
    projects: {},
    cards: {},
    users: {},
    cursors: {},
    container: {},
    projectID: null,
    projectMetadata: null,
    currentActive: null,
    get userID() {
        return this.currentUser && this.currentUser.uid
    },
    permission: "",
    currentUser: false,
    zoom: 1,
    validproject: '',
    get projectName() {
        return this.projectMetadata && this.projectMetadata.name
    },
    get firebaseConfig() {
        return FIREBASE_CONSTANTS.UI_CONFIG;
    },
    get ownProjects() {
        return Object.keys(this.projects).filter(id => !this.projects[id].shared)
    },
    get sharedProjects() {
        return Object.keys(this.projects).filter(id => this.projects[id].shared)
    },
    get projectRef() {
        return database.ref("documents").child(this.projectID)
    },
    get userRef() {
        if (this.userID.length > 1)
            return database.ref("users").child(this.userID).child("projects")
        else
            return this.userID
    },
    get hitTestCards() {
        return Object.keys(this.cards)
    },
    get userCount() {
        return this.users ? Object.keys(this.users).length : 0
    },
    getActionQuery(callback) {
        database.ref("actionsearch")
            .once('value').then(snap => { callback(snap.val()) })
            .catch(err => console.log("Error in GETACTION is: ", err));
    },
    syncUser() {
        if (auth().currentUser?.uid) {
            this.currentUser = auth().currentUser;
        }
        else {
            this.currentUser = false;
        }
    },
    isProjectValid(id,callback) {
        this.userRef.once('value')
            .then(snap => { callback(snap.hasChild(id))})
            .catch(error => console.log("While Validating Project", error));
    },
    // dashboard related actions
    addNewProject() {
        const thumbnails = [require("../assets/1.webp"), require("../assets/2.webp"), require("../assets/3.webp"), require("../assets/4.webp")]
        const thumbnailURL = thumbnails[Math.floor(Math.random() * thumbnails.length)]
        const template = {
            metadata: {
                name: "New Project",
                thumbnailURL: thumbnailURL,
                datecreated: servertime
            },
            lastActive: {
                [this.currentUser.uid]: servertime
            },
            users: {
                [this.currentUser.uid]: {
                    "permission": "admin", /*> r = 0  rw = 1 admin = 2*/
                    "email": this.currentUser.email,
                    "photoURL": this.currentUser.photoURL,
                    "name": this.currentUser.displayName,
                }
            },
            ...projectTemplates.tester
        }
        const newProjectID = database.ref("documents").push(template).key
        this.userRef.child(newProjectID).set({
            access: "admin",
            name: "New Project",
            thumbnailURL: thumbnailURL,
            createdAt: servertime,
        })
    },
    deleteProject(id) {
        database.ref("garbagecollection").child(id).set(servertime).then(() => {
            database.ref("documents").child(id).child("users")
                .once("value")
                .then((snap) => {
                    let updates = {}
                    Object.keys(snap.val()).forEach((userID) => updates[userID + "/projects/" + id] = null)
                    database.ref("users").update(updates)
                        .then(database.ref("documents").child(id).set(null))
                });
        })
    },
    renameProject(id, title) {
        database.ref("documents").child(id).child("metadata").child("name").set(title)
        database.ref("documents").child(id).child("users")
            .once("value")
            .then((snap) => {
                let updates = {}
                Object.keys(snap.val()).forEach((userID) => updates[userID + "/projects/" + id + "/name"] = title)
                database.ref("users").update(updates)
            }
            )
    },
    // document related actions
    saveCursorPosition: throttle(function saveCursorPosition(x, y) {
        this.updateLastActive()
        this.projectRef.child("cursors").child(this.userID)
            .set({ x: x, y: y })
            .then(() => { })
            .catch(err => console.log("error sending cursor position to others", err))
    }, 100),
    updateLastActive: throttle(function updateLastActive() {
        this.projectRef &&
            this.projectRef.child("users").child(this.userID).child("lastUpdatedAt")
                .set(servertime)
    }, 5000),
    setProjectID(newProjectID) {
        this.projectID = newProjectID;
        if (this.projectID) this.addDocumentListeners();
        else this.removeDocumentListeners();
    },
    // card related actions
    addCard(position, size, newparent, newtype) {
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
        let newCardKey = this.projectRef.child("nodes").push().key;

        // use that key to 
        // a) push the new card schema 
        // b) update the "children" property of parent
        let updates = {};
        updates[parent + "/children/" + newCardKey] = 1;
        updates[newCardKey] = newCard;
        this.projectRef.child("nodes").update(updates)
            .then(() => console.log("Added a new child", newCardKey, "under", parent));
        this.updateLastActive()
    },
    removeCard(id, strategy, newParent) {
        this.updateLastActive()
        const updates = {};
        updates[id] = null;
        updates[this.cards[id]["parent"] + "/children/" + id] = null;

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

        switch (strategy) {
            case "recursive":
                if (this.cards[id]["children"])
                    depthFirstTraversal(Object.keys(this.cards[id]["children"]));
                break;
            case "reparent":
                Object.keys(this.cards[id]["children"])
                    .forEach(child => updates[child + "/parent"] = newParent);
                break;
            default:
                break;
        }
        this.projectRef.child("nodes").update(updates)
            .then(console.log("deleted", id, "successfully"));
    },
    changePosition(id, newPos) {
        this.cards[id]["position"] = newPos;
    },
    savePosition(id, newPos) {
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
    },
    resize(id, newSize) {
        this.updateLastActive()
        this.projectRef.child("nodes").child(id).child("size")
            .set(newSize)
            .then(console.log("set new size for", id, "to", newSize));
    },
    saveContent: throttle(function saveContent(id, newContent) {
        this.updateLastActive()
        this.projectRef.child("nodes").child(id).child("content")
            .set(newContent)
            .then(console.log("saved new content for", id))
            .catch(err => console.log("error saving new content for", id, err))
    },
        500),
    changeContent(id, newContent) {
        console.log("triggered local content change on", id);
        this.cards[id]["content"] = newContent;
        this.saveContent(id, newContent);
    },
    changeType(id, newType, size, content) {
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
    },
    reparentCard(id, newParent) {
        this.updateLastActive()
        console.log("reparent requested for", id, "newparent", newParent)

        function checkValidity(ancestor) {
            if (ancestor === "root") return true;
            if (ancestor === id) return false;
            return checkValidity(this.cards[ancestor]["parent"]);
        }

        if (checkValidity(newParent)) {
            let updates = {};
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
        console.log("didn't reparent because it was just not a valid request. do better next time.")
    },
    requestUpload(uploadPath, file, metadata, statusCallback) {
        let custom = {
            ...metadata,
            customMetadata: {
                [this.userID]: this.users[this.userID].permission
            }
        }
        console.log("metadata sent was", custom)
        const path = "root/" + this.projectID + "/" + uploadPath;
        let requestedPathRef = storage().ref(path);
        let uploadTask = requestedPathRef.put(file, custom);
        let unsubscribe = uploadTask.on(storage.TaskEvent.STATE_CHANGED,
            (nextSnapshot) => statusCallback(nextSnapshot.bytesTransferred / nextSnapshot.totalBytes * 100, uploadTask), // on upload progress
            null, // error handling -- nonexistent!
            () => { statusCallback("complete"); unsubscribe(); } // on completion
        )
    },
    requestDownload(downloadPath, callback) {
        const path = "root/" + this.projectID + "/" + downloadPath;
        let requestedPathRef = storage().ref(path)
        requestedPathRef.getDownloadURL()
            .then((url) => {
                requestedPathRef.getMetadata()
                    .then((metadata) => callback(url, JSON.parse(JSON.stringify(metadata))))
                    .catch((reason) => console.log("failed to fetch metadata for", path, "because", reason))
            })
            .catch((reason) => console.log("failed to fetch download URL for", path, "because", reason))
    },
    // update any property of store (for use with listeners)
    sync(property, path, value) {
        set(this[property], path, value)
    },
    highlightSearched(result, belongsTo) {
        if (belongsTo === 'projects' && result.length > 0)
            Object.entries(result).forEach(([_, val]) => {
                this.projects[val.id].highlight = true;
            })
    },
    addKeyToShare(permission) {
        const newSharedKey = this.projectRef.child("sharing").push().key;
        let updates = {};
        updates[newSharedKey] = permission;
        this.projectRef.child("sharing")
            .update(updates)
            .then(console.log("successfully Added key ", newSharedKey))
            .catch((reason) => console.log("error in updating key because", reason));
        return (newSharedKey);
    },
    createSharedUser(projectID, keyId, permission, callback) {
        this.updateLastActive()
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
    },
    addUserEditing(id) {
        this.projectRef.child('nodes').child(id).child("editing")
            .set({ [this.userID]: servertime })
            .then(console.log("this user is editing card", id))
            .catch(error => console.log("error raised in addUserEditing because ", error))
    },
    removeUserEditing(id) {
        this.projectRef.child('nodes').child(id).child("editing")
            .set(null)
            .then(console.log("This User is Editing"))
            .catch(error => console.log("Error raised in addUserEditing because ", error))
    },
    // listener manipulation
    addDashboardListeners() {
        if (this.userRef && this.userID.length > 1) {
            const projects = this.userRef.orderByChild("createdAt");
            projects.on("child_added", (snap) => this.projects[snap.key] = snap.val());
            projects.on("child_changed", (snap) => this.projects[snap.key] = snap.val());
            projects.on("child_removed", (snap) => delete this.projects[snap.key]);
        }
    },
    addDocumentListeners() {
        this.projectRef.child("users").on("value", (snap) => this.users = snap.val());
        this.projectRef.child("nodes").on("child_added", (snap) => this.cards[snap.key] = snap.val());
        this.projectRef.child("nodes").on("child_changed", (snap) => this.cards[snap.key] = snap.val());
        this.projectRef.child("nodes").on("child_removed", (snap) => delete this.cards[snap.key]);
        this.projectRef.child("container").on("value", (snap) => this.container = snap.val());
        this.projectRef.child("metadata").on("value", (snap) => this.projectMetadata = snap.val());
    },
    addCursorListener() {
        this.projectRef.child("cursors").on('value', (snap) => this.cursors = snap.val());
    },
    removeDashboardListeners() {
        if (this.userID.length > 1)
            database.ref("users").child(this.userID).child("projects").orderByChild("createdAt").off();
    },
    removeDocumentListeners() {
        this.projectRef.child("users").off();
        this.projectRef.child("nodes").off();
        this.projectRef.child("container").off();
        this.projectRef.child("metadata").off();

        this.cards = {}
        this.users = {}
        this.cursors = {}
        this.container = {}
    },
    removeCursorListener() {
        this.projectRef.child("cursors").off()
    },

    // auth related actions
    signout() {
        auth().signOut()
    },

};