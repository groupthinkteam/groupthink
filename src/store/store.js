import set from "lodash.set"
import throttle from "lodash.throttle"
import { database, storage, auth, servertime, functions } from "../services/firebase"
import projectTemplates from "../constants/projectTemplates"
import "mobx-react-lite"
import { FIREBASE_CONSTANTS } from "../constants/firebaseConstants"

export var storeObject = {
    filteredProjectID: [],
    projects: {},
    cards: {},
    users: {},
    cursors: {},
    container: {},
    projectID: null,
    projectMetadata: null,
    currentActive: null,
    collapsedID: {},
    documentLoadPercent: 0,
    currentContext: '',
    recentSearches: {},
    clickTargetGeneric: '',
    toggleCollapse: false,
    get userID() {
        return this.currentUser && this.currentUser.uid
    },
    permission: "",
    currentUser: false,
    zoom: 1,
    validproject: '',
    toggleArrows: true,
    get projectName() {
        return this.projectMetadata && this.projectMetadata.name
    },
    get firebaseConfig() {
        return FIREBASE_CONSTANTS.UI_CONFIG;
    },
    get allProjects() {
        return Object.keys(this.projects)
    },
    get sharedProjects() {
        return Object.keys(this.projects).filter(id => this.projects[id].shared)
    },
    get starredProjects() {
        return Object.keys(this.projects).filter(id => this.projects[id].users[this.userID].isStarred)
    },
    get searchedProject() {

        return Object.keys(this.projects).filter(id => this.filteredProjectID.indexOf(id) !== -1)
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
    addToRecentSearch(id) {
        console.log("Check recent search ID", id, this.projectID);
        const k = this.projectID
        this.recentSearches[id] = k;
        console.log("Check recent search ID", this.recentSearches);
        // if(this.recentSearches.indexOf(id) !== 0)
        // this.recentSearches.push(id);
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
    isProjectValid(id, callback) {
        this.userRef.once('value')
            .then(snap => { callback(snap.hasChild(id)) })
            .catch(error => console.log("While Validating Project", error));
    },
    // dashboard related actions
    addNewProject(callback, tempId, projectName) {
        const thumbnails = [require("../assets/1.webp"), require("../assets/2.webp"), require("../assets/3.webp"), require("../assets/4.webp")]
        const thumbnailURL = thumbnails[Math.floor(Math.random() * thumbnails.length)]

        const template = {
            metadata: {
                name: projectName,
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
            ...projectTemplates[tempId || 'blank']
        }

        const newProjectID = database.ref("documents").push(template).key
        this.userRef.child(newProjectID).set({
            access: "admin",
            name: projectName,
            thumbnailURL: thumbnailURL,
            createdAt: servertime,
        }).then(() => callback(newProjectID))
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
    localRenameProject(title) {
        this.projectMetadata.name = title
    },
    renameProject(id, title) {
        database.ref("documents").child(id).child("metadata").child("name").set(title)
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
    addCard(position, size, newparent, newtype, getIDCallback) {
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
            .then(() => {
                console.log("Added a new child", newCardKey, "under", parent, "with position ", position)
                if (getIDCallback)
                    getIDCallback(newCardKey)
            });
        this.updateLastActive()
    },
    removeCard(id, strategy, newParent) {
        this.updateLastActive();
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
                console.log("RECURSIVE ", this.cards[id]["children"])
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
            .then(console.log("deleted", id, "successfully")).catch(error => console.log("couldn't reparent because ", error));
    },
    filterProject(searchResult) {
        this.filteredProjectID = []
        if (searchResult.matches.length > 0)
            for (let i = 0; i < searchResult.matches.length; i++) {
                const match = searchResult.matches[i];
                //if(match.score > searchResult.matches.length)
                this.filteredProjectID.push(match.id);
            }
        else
            this.filteredProjectID = [];
    },
    starredThisProject(id) {
        console.log(this.projects[id].users[this.userID].name)
        database.ref("documents").child(id)
            .child(`users/${this.userID}/isStarred`)
            .set(true).then(console.log(id, " This Project is starred in USERS"))
            .catch(err => console.log("Error in setting Starred ", err));
    },
    unStarredThisProject(id) {
        database.ref("documents").child(id)
            .child(`users/${this.userID}/isStarred`)
            .set(null).then(console.log(id, " This Project is starred in USERS"))
            .catch(err => console.log("Error in setting Starred ", err));
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
    saveContainerSize() {
        this.updateLastActive()
        this.projectRef.child('container')
            .set(this.container)
            .then(console.log("set new size for container ", this.container.height, this.container.width));
    },
    saveContent: throttle(function saveContent(id, newContent) {
        this.updateLastActive()
        this.projectRef.child("nodes").child(id).child("content")
            .set(newContent)
            .then(console.log("saved new content for", id))
            .catch(err => console.log("error saving new content for", id, err))
    },
        500),
    changeSize(id, size) {
        console.log("triggered local size change on", id);
        this.cards[id]["size"] = size;
    },
    changeContent(id, newContent) {
        console.log("triggered local content change on", id);
        this.cards[id]["content"] = newContent;
        this.saveContent(id, newContent);
    },
    changeType(id, newType, size, content, callback) {
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
    changeContainerSizeLocal(size) {
        this.container = size
    },
    makeCardChild(id, newChildId, strategy) {
        const parentID = this.cards[id].parent;
        const dropParent = this.cards[newChildId].parent;
        const updates = {};
        console.log("Check", "ID THAT STARTED DRAG ", id, "ITS PARENT", parentID, "TO DROP ", newChildId, dropParent)
        const throwParent = (ancestor) => {
            console.log("ANCESTOR", ancestor);
            return this.cards[ancestor]["parent"]
        }
        const throwChildren = (children) => {
            return this.cards[children]?.children
        }
        const checkChildrens = (childrens) => {
            const subChildrens = throwChildren(childrens);
            console.log("SUBCHILDRENS ",typeof subChildrens, subChildrens, childrens, newChildId)
            if (!childrens) return true
            if (childrens && childrens[newChildId]) return false
            
            return checkValiditys(subChildrens)
        }
        function checkValiditys(ancestor) {
            const parent = throwParent(ancestor)
            const children = throwChildren(newChildId)
            if (ancestor === newChildId) return false;
            if (children && children[parentID]) return false
            else if (ancestor === "root") return true

            const ancestorChildren = throwChildren(ancestor);
            console.log("CHILDRENs", ancestorChildren);
            //One Level Down of Each parent - checkChildrens() for chidlren heirarchy
            if (ancestorChildren && ancestorChildren[newChildId]) return false

            return checkValiditys(parent);
        }
        if (checkValiditys(parentID)) {
            console.log("REPARENT - MAKE CHILD", id, newChildId)
            if (dropParent === parentID) {
                updates[id + "/children/" + newChildId] = 1;
                updates[newChildId + "/parent/"] = id;
            }
            else if (!strategy) {
                updates[dropParent + "/children/" + newChildId] = null;
                updates[parentID + "/children/" + newChildId] = 1;
                updates[newChildId + "/parent/"] = parentID;
            }
            else {
                updates[dropParent + "/children/" + newChildId] = null;
                updates[id + "/children/" + newChildId] = 1;
                updates[newChildId + "/parent/"] = id;
            }

            this.projectRef.child("nodes")
                .update(updates)
                .then(console.log("successfully added the children of", id, "to", newChildId, updates))
                .catch((reason) => console.log("error making child because", reason));
        }
        else {
            console.log("DONT Make CHILD")
        }
    },
    reparentCard(id, newParent, strategy) {
        this.updateLastActive()
        console.log("reparent requested for", id, "newparent", newParent);
        const throwParent = (ancestor) => { return this.cards[ancestor]["parent"] }


        function checkValidity(ancestor) {
            if (ancestor === "root") return true;
            if (ancestor === id) return false;
            const parent = throwParent(ancestor)
            return checkValidity(parent);
        }
        if (checkValidity(newParent)) {
            const updates = {};
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
    requestUpload(uploadPath, file, metadata, statusCallback, use) {
        console.log("userID", this.users)
        var custom = {}
        var path = ''
        if (use !== "pfp") {
            custom = {
                ...metadata,
                customMetadata: {
                    [this.userID]: this.users[this.userID].permission
                }
            }
            path = "root/" + this.projectID + "/" + uploadPath;
        }
        else {
            custom = {
                ...metadata,
                customMetadata: {
                    [this.userID]: "admin"
                }
            }
            path = "root/profiles/" + this.userID + "/pfp/profilePic"; //+ uploadPath;
        }

        console.log("metadata sent was", custom)
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
    updateProfilePicture() {
        const path = `root/profiles/${this.userID}/pfp/profilePic`;
        const requestedPathRef = storage().ref(path)
        requestedPathRef.getDownloadURL()
            .then((url) => {
                auth().currentUser.updateProfile({
                    photoURL: url
                })
            })
            .catch((reason) => console.log("failed to fetch download URL for", path, "because", reason))
    },
    convertCardToBlank(id, type) {
        if (!type) {
            const pathToFile = this.cards[id].content.metadata.fullPath
            const ref = storage().ref(pathToFile);
            ref.delete().then(console.log("File Deleted")).catch(err => console.log("File Delete Error", err))
        }
        this.changeType(id, 'blank', { width: 275, height: 45 }, { text: '' });
    },
    sendInviteEmail(data) {
        var sendLinkEmail = functions.httpsCallable('sendLinkEmail')
        return sendLinkEmail(data)
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
        console.log("keys ", this.projectRef.child("sharing").once('value').then((snapshot) => snapshot.val()))
        return (newSharedKey);
    },
    checkKeys() {
        const check = this.projectRef.child("sharing").once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return true;
                }
            })
            .catch((err) => err)
        return check;
    },
    fetchKeys() {
        const keys = this.projectRef.child("sharing").once('value')
            .then((snapshot) => {
                return snapshot.val()
            })
            .catch((err) => console.log(err))
        return keys
    },
    removeKey() {
        const keys = this.projectRef.child("sharing").remove()
            .then(() => {
                console.log("Removed")
            })
            .catch((err) => console.log(err))
        return keys
    },
    createSharedUser(projectID, keyId, permission, callback) {
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
    },
    collapseCard(id, strategy) {
        strategy ? this.collapsedID[id] = strategy : this.cards[id]["isCollapse"] = true;
    },
    expandCard(id, strategy) {
        strategy ? this.collapsedID[id] = null : this.cards[id]["isCollapse"] = null;
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
            .then(console.log("This User is Now Not Editing"))
            .catch(error => console.log("Error raised in addUserEditing because ", error))
    },
    addUserCallInfo(info) {
        this.projectRef.child('users').child(this.userID)
            .update({ joinedCall: true }) //TODO: can add speaking Feature
            .then(console.log("This User has Joined Call"))
            .catch(error => console.log("Error raised in addUserCallInfo because ", error))
    },
    removeUserCallInfo(info) {
        this.projectRef.child('users').child(this.userID)
            .update({ joinedCall: null })
            .then(console.log("This User has Not Joined Call"))
            .catch(error => console.log("Error raised in removeUserCallInfo because ", error))
    },
    // listener manipulation
    addDashboardListeners(forceRefreshCallback) {
        this.addWelcomeIfNotExists(forceRefreshCallback)
        if (this.userRef && this.userID.length > 1) {
            this.userRef.on("child_added", (snap) => {
                database.ref("documents").child(snap.key).child("metadata")
                    .on("value", (meta) => this.projects[snap.key] = { ...snap.val(), metadata: meta.val() });
                database.ref("documents").child(snap.key).child("users").on("value", (users) => {
                    this.projects[snap.key] = { ...this.projects[snap.key], users: users.val() }
                });
            })
            this.userRef.on("child_removed", (snap) => {
                database.ref("documents").child(snap.key).child("metadata").off();
                delete this.projects[snap.key];
            })
        }
    },
    addWelcomeIfNotExists(forceRefreshCallback) {
        if (this.userID.length > 1) {
            if (!this.currentUser.photoURL) {
                let randomImageIndex = Math.floor(Math.random() * 4) + 3
                storage().ref(`root/default-profile/Frame ${randomImageIndex}.png`)
                    .getDownloadURL().then(
                        (url) => {
                            auth().currentUser
                                .updateProfile({ photoURL: url })
                                .then(forceRefreshCallback);
                        }
                    ).catch((error) => { console.log("unable to set default profile picture because", error) })
            }
            database.ref("users").child(this.userID).child("welcome").once("value")
                .then((snap) => {
                    if (!snap.val()) {
                        database.ref("users").child(this.userID).child("welcome").set(true)
                        this.addNewProject(data => { forceRefreshCallback(); window.location.reload(); }, "introProject", "Welcome! Start Here...")
                    }
                }
                )
        }
    },
    addDocumentListeners() {
        this.projectRef.child("users").on("value", (snap) => {
            this.users = snap.val();
            this.documentLoadPercent += 1
        });
        this.projectRef.child("nodes").on("child_added", (snap) => this.cards[snap.key] = snap.val());
        this.projectRef.child("nodes").on("child_changed", (snap) => this.cards[snap.key] = snap.val());
        this.projectRef.child("nodes").on("child_removed", (snap) => delete this.cards[snap.key]);
        this.projectRef.child("container").on("value", (snap) => this.container = snap.val());
        this.projectRef.child("metadata").on("value", (snap) => {
            this.projectMetadata = snap.val();
            if (this.projectMetadata)
                this.documentLoadPercent += 1
        });
    },
    addCursorListener() {
        this.projectRef.child("cursors").on('value', (snap) => this.cursors = snap.val());
    },
    removeDashboardListeners() {
        if (this.userID.length > 1) {
            this.userRef.off();
            Object.keys(this.projects)
                .forEach((key) => {
                    database.ref("documents").child(key).child("metadata").off();
                    database.ref("documents").child(key).child("users").off()
                })
        }
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
        this.documentLoadPercent = 0
    },
    removeCursorListener() {
        this.projectRef.child("cursors").off()
    },

    // auth related actions
    signout() {
        auth().signOut()
    },

    // actions
    // ------------
    // args must contain a valid card ID
    runAction(name, id, callback) {
        let card = this.cards[id]
        let addCard = this.addCard
        let saveContent = this.saveContent
        let projectId = this.projectID

        function summarize() {
            const API_KEY = "89A59B5393";
            fetch(`https://api.smmry.com/SM_API_KEY=${API_KEY}&SM_WITH_BREAK&SM_URL=${card.content.url}`)
                .then((response) => {
                    response.json().then((json) => {
                        if (json.sm_api_error !== undefined) {
                            callback(false)
                        }
                        addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                            { height: 200, width: 400 },
                            id,
                            "text",
                            (newID) => {
                                let content = json.sm_api_content?.split("[BREAK]").map((line) => "<li>" + line + "</li>")
                                saveContent(newID, { text: "<ol>" + content.join(" ") + "</ol>" })
                            })
                        console.log({
                            percentReduced: json.sm_api_content_reduced,
                            content: json.sm_api_content?.split("[BREAK]")
                        })
                        callback(true)
                    })
                })
        }
        function getYtCaptions() {
            if (!card.content.metadata.url.includes("www.youtube.com")) {
                callback("error")
            }
            const urlParts = card.content.metadata.url.split('=')
            const vidId = urlParts[urlParts.length - 1]

            fetch(`https://video.google.com/timedtext?lang=en&v=${vidId}`)
                .then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                .then(data => {
                    var lines = data.getElementsByTagName('text')
                    var fullCap = ""
                    var lLength = lines.length
                    for (var i = 0; i < lLength; i++) {
                        fullCap = fullCap + " " + lines[i].childNodes[0].nodeValue
                    }
                    fullCap = fullCap.replace(/\n/g, ' ').replaceAll('&#39;', "'")
                    //copyLink(fullCap);
                    addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                        { height: 200, width: 400 },
                        id,
                        "text",
                        (newID) => {
                            let content = fullCap?.split("[BREAK]").map((line) => "<li>" + line + "</li>")
                            saveContent(newID, { text: "<ol>" + content.join(" ") + "</ol>" })
                        })
                })
                .then(() => callback(true))
                .catch(() => callback(false))
        }
        function convFile() {
            var convToPdf = functions.httpsCallable('fileConv')
            const customMetadata = card.content.metadata.customMetadata
            const data = {
                fullpath: card.content.metadata.fullPath,
                outformat: "pdf",
                updateMetadata: {
                    metadata: {
                        [Object.keys(customMetadata)[0]]: customMetadata[Object.keys(customMetadata)[0]]
                    }
                }
            }
            convToPdf(data).then(() => callback(true)).catch(() => callback(false))

        }
        function convertLinksToCitation() {
            var fullText = []
            var convToCite = functions.httpsCallable('linkToCitation')
            fullText = card.content.text
            console.log("full text: ", fullText);
            var linksArr = linksFromText(fullText);
            if (linksArr.length === 0) {
                return callback(false)
            }
            const linksData = {
                projectId: projectId,
                cardId: id,
                link: linksArr,
                fullText: fullText,
                style: "apa"
            }
            console.log("links data: ", linksData)
            return convToCite(linksData).then(() => callback(true)).catch(() => callback(false))
        }
        function linksFromText(stri) {
            const regexp = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
            const str = String(stri);
            var array = []
            if (str.match(regexp) !== null) {
                array = [...str.match(regexp)];
            }
            return array
        }
        function convertImageToBW() {
            const imageData = {
                fpath: card.content.metadata.fullPath,
                contentType: card.content.metadata.contentType,
                customMetadata: card.content.metadata.customMetadata
            }
            var convToBw = functions.httpsCallable('imageToBw')
            return convToBw(imageData).then(() => callback(true)).catch(() => callback(false))
        }
        if (name === "summarize") {
            summarize()
        }
        if (name === "getYtCaptions") {
            getYtCaptions()
        }
        if (name === "convFile") {
            convFile()
        }
        if (name === "convertLinksToCitation") {
            convertLinksToCitation()
        }
        if (name === "convertImageToBW") {
            convertImageToBW()
        }
    },
    actionsList: {
        "summarize": {
            id: "summarize",
            title: "Summarize a link",
            description: "uses AI to create a summary of a webpage or PDF",
            types: ["link"]
        },
        "getYtCaptions": {
            id: "getYtCaptions",
            title: "Extract subtitles from a Youtube video",
            description: "extracts available closed captions from a Youtube video",
            types: ["VideoLink"]
        },
        "convFile": {
            id: "convFile",
            title: "Convert file to PDF",
            description: "converts your file to pdf format",
            types: ["file"]
        },
        "convertLinksToCitation": {
            id: "convertLinksToCitation",
            title: "Generate APA style citations",
            description: "generates citations for all the research publication links in your text",
            types: ["text"]
        },
        "convertImageToBW": {
            id: "convertImageToBW",
            title: "Convert image to grayscale",
            description: "converts an image to grayscale",
            types: ["image"]
        }
    },
    // actions UI
    actionsUI: {
        isSelectingCard: false,
        selectedAction: null,
    },

    // project templates
    useTemplate(name, callback) {
        if (name === "classDash") {
            this.addNewProject(data => callback(data), name, this.templatesList[`${name}`].title)
        }
        if (name === "blank") {
            this.addNewProject(data => callback(data), name, this.templatesList[`${name}`].title)
        }
    },
    templatesList: {
        "blank": {
            id: "blank",
            title: "Blank Project",
            description: "Start a blank project."
        },
        "classDash": {
            id: "classDash",
            title: "Class Dashboard",
            description: "Take notes, organize articles, make summaries and more with this template."
        },
        "tripPlanning": {
            id: "tripPlanning",
            title: "Trip Planning",
            description: "Plan your dream vacation easily with this template."
        }
    },
    templatesUI: {
        selectedTemplate: null
    }
}