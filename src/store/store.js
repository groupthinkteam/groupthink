import set from "lodash.set"
import throttle from "lodash.throttle"
import { database, storage, auth, servertime, functions, analytics } from "../services/firebase"
import projectTemplates from "../constants/projectTemplates"
import "mobx-react-lite"
import { FIREBASE_CONSTANTS } from "../constants/firebaseConstants"

export var storeObject = {
    filteredProjectID: [],
    projects: {},
    cards: {},
    tasks: {},
    users: {},
    cursors: {},
    container: {},
    projectID: null,
    projectMetadata: null,
    currentActive: null,
    collapsedID: {},
    documentLoadPercent: 0,
    currentContext: '',
    editingCard: null,
    recentSearches: {},
    clickTargetGeneric: '',
    toggleCollapse: false,
    cardGrouped: [],
    followAUser: false,
    get userID() {
        return this.currentUser && this.currentUser.uid
    },
    permission: "",
    currentUser: false,
    zoom: 1,
    validproject: '',
    toggleArrows: true,
    selectedCards: [],
    textareaRef: null,
    isCardShrinked: false,
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
    get tasksRef() {
        return database.ref("documents").child(this.projectID).child('tasks')
    },
    get hitTestCards() {
        return Object.keys(this.cards)
    },
    get userCount() {
        return this.users ? Object.keys(this.users).length : 0
    },
    /**
     * This Function Adds New Property to Node on Firebase
     * @param {String} Id - Id of card / node
     * @param {Object} property - Property to be Add in Node
     */
    addCardProperty(Id, property) {
        this.projectRef.child("nodes").child(Id)
            .update(property)
            .then(() => {
                console.log(property, " Added to Card ID ", Id);
            })
            .catch(err => console.log("Error in Saving Card Color ", err));
    },
    /**
     * Saves Card Color to Firebase
     * @param {string} id - Id of Card
     * @param {String} hex - Color in HexaDecimal
     */
    saveCardColors(id, hex) {
        this.projectRef.child("nodes").child(id).child('color')
            .set(hex)
            .then(() => {
                console.log("Added ", hex, "COLOR to ", id)
            })
            .catch(err => console.log("Error in Saving Card Color ", err));
    },
    /**
     * Locally Saves Card Color
     * @param {String} hex - Color in HexaDecimal
     */
    addColorsToCards(hex) {
        this.cardGrouped.forEach(Id => {
            this.cards[Id]["color"] = hex
        })
    },
    /**
     * Adds Selected Card if Id to Recent Searches Array
     * @param {String} id 
     */
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
    /**
     * Authenticate LoggedIn User Info & userID
     */
    syncUser() {
        if (auth().currentUser?.uid) {
            this.currentUser = auth().currentUser;
        }
        else {
            this.currentUser = false;
        }
    },
    /**
     * Checks Project Validity of Provided ID
     * @param {String} id - ID of Project
     * @param {Function} callback - Callback for validity status (T/F)
     */
    isProjectValid(id, callback) {
        this.userRef.once('value')
            .then(snap => { callback(snap.hasChild(id)) })
            .catch(error => console.log("While Validating Project", error));
    },
    //------------------------------------ DASHBOARD RELATED ACTIONS ----------------------------------
    /**
     * Creates New Projects & Setup Project-BASE 
     * @param {*} callback - Callback for project setup
     * @param {String} tempId - ID to Which Kind of Project to setup (Blank is default)
     * @param {*} projectName - Provide Name to project (Optional) 
     */
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
    /**
     * Deletes Project of corresponding ID
     * - Goes in Garbage Collection 
     * @param {String} id 
     */
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
    /**
     * Rename Project Locally
     * @param {String} title 
     */
    localRenameProject(title) {
        this.projectMetadata.name = title
    },
    /**
     * Updates the updated Name of Project to Firebase
     * @param {String} id 
     * @param {String} title 
     */
    renameProject(id, title) {
        database.ref("documents").child(id).child("metadata").child("name").set(title)
    },

    //------------------------------------------END : dashboard related actions ----------------------------------

    //------------------------------------------ START: DOCUMENT RELATED ACTIONS ---------------------------------
    /**
     * Saves Cursor Position of Current User to Firebase
     */
    saveCursorPosition: throttle(function saveCursorPosition(x, y) {
        this.updateLastActive()
        this.projectRef.child("cursors").child(this.userID)
            .set({ x: x, y: y })
            .then(() => { })
            .catch(err => console.log("error sending cursor position to others", err))
    }, 100),
    /**
     * Updates Last Active Time of Current User of Current Project
     */
    updateLastActive: throttle(function updateLastActive() {
        this.projectRef &&
            this.projectRef.child("users").child(this.userID).child("lastUpdatedAt")
                .set(servertime)

    }, 5000),
    /**
     * Sets Project ID to Store Object For Global Access
     * @param {String} newProjectID 
     */
    setProjectID(newProjectID) {
        this.projectID = newProjectID;
        if (this.projectID) this.addDocumentListeners();
        else this.removeDocumentListeners();
    },
    // card related actions
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
    addCard(position, size, newparent, newtype, getIDCallback, optionalID) {
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
    },
    /**
     * Deletes Card & Instance from FIREBASE with Strategy :
     * - In Recursive strategy Deletes Current card along with it's children and sub-children 
     * - In Reparent Strategy Deletes Current Card And Reparent it's to the Deleted Card Parent
     * @param {String} id - ID of card
     * @param {String} strategy - 'Recursive' or 'Reparent'
     * @param {String} newParent - newParent for children
     */
    removeCard(id, strategy, newParent) {
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
    },
    /**
     * Filter's the Project According to Search Result
     * @param {Object} searchResult - Containes 'matches as property' which is array of matched Items  
     */
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
    /**
     * Starred the Projects and Saves to Firebase
     * @param {String} id 
     */
    starredThisProject(id) {
        console.log(this.projects[id].users[this.userID].name)
        database.ref("documents").child(id)
            .child(`users/${this.userID}/isStarred`)
            .set(true).then(console.log(id, " This Project is starred in USERS"))
            .catch(err => console.log("Error in setting Starred ", err));
    },
    /**
     * Un-Starred the Projects and Saves to Firebase
     * @param {String} id 
    */
    unStarredThisProject(id) {
        database.ref("documents").child(id)
            .child(`users/${this.userID}/isStarred`)
            .set(null).then(console.log(id, " This Project is starred in USERS"))
            .catch(err => console.log("Error in setting Starred ", err));
    },
    /**
     * Locally saves Change in Position of Card
     * @param {*} id - ID of card
     * @param {*} newPos - New Position Of Card
     */
    changePosition(id, newPos) {
        this.cards[id]["position"] = newPos;
    },
    /**
     * Saves Change in Position of Card to FIREBASE
     * @param {*} id - ID of card
     * @param {*} newPos - New Position Of Card
     */
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
    /**
     * Updates New Size of Card to FIREBASE 
     * @param {String} id 
     * @param {Object} newSize 
     */
    resize(id, newSize) {
        this.updateLastActive()
        this.projectRef.child("nodes").child(id).child("size")
            .set(newSize)
            .then(console.log("set new size for", id, "to", newSize));
    },
    /**
     * Saves Updated Local Container Size to FIREBASE 
     */
    saveContainerSize() {
        this.updateLastActive()
        this.projectRef.child('container')
            .set(this.container)
            .then(console.log("set new size for container ", this.container.height, this.container.width));
    },
    /**
     * Saves the Change OF Content & updates to FIREBASE 
     */
    saveContent: throttle(function saveContent(id, newContent) {
        this.updateLastActive()
        this.projectRef.child("nodes").child(id).child("content")
            .set(newContent)
            .then(console.log("saved new content for", id))
            .catch(err => console.log("error saving new content for", id, err))
    },
        500),
    /**
     * Locally Save the change in size of Given Card ID
     * @param {String} id 
     * @param {Object} size 
     */
    changeSize(id, size) {
        console.log("triggered local size change on", id);
        this.cards[id]["size"] = size;
    },
    /**
     * Locally Updates Content of given cardID
     * @param {String} id 
     * @param {Object | String} newContent 
     */
    changeContent(id, newContent) {
        console.log("triggered local content change on", id);
        this.cards[id]["content"] = newContent;
        this.saveContent(id, newContent);
    },
    /**
     * Responsible For Selected Formating of Text in Text Card :
     * - Bold
     * - Italic
     * - Underline
     * - Head 1 , 2 , 3, 4
     * @param {String} event Name Of Event that has to be in the format
     */
    formatText(event) {
        console.log("event ", event)
        const store = this;
        let text = store.cards[store.currentActive].content.text;
        let start = store.textareaRef.current.selectionStart;
        let end = store.textareaRef.current.selectionEnd;
        let newText;
        switch (event) {
            case 'bold':
                newText = text.substring(0, start) + "**" + text.substring(start, end) + "**" + text.substring(end, text.length);
                break;
            case 'head1':
                newText = text.substring(0, start) + " # " + text.substring(start, text.length);
                break;
            case 'head2':
                newText = text.substring(0, start) + " ## " + text.substring(start, text.length);
                break;
            case 'head3':
                newText = text.substring(0, start) + " ### " + text.substring(start, text.length);
                break;
            case 'head4':
                newText = text.substring(0, start) + " #### " + text.substring(start, text.length);
                break;
            case "italic":
                newText = text.substring(0, start) + "*" + text.substring(start, end) + "*" + text.substring(end, text.length);
                break;
            case "underline":
                newText = text.substring(0, start) + "<u>" + text.substring(start, end) + "</u>" + text.substring(end, text.length);
                break;
            default: break;
        }
        console.log("NEW TEXT ", newText)
        store.changeContent(store.currentActive, { text: newText });
        store.textareaRef.current.focus();
        store.textareaRef.current.selectionEnd = end - 2;
    },
    /**
     * Saves the Change in Type of Given ID With it's new Type  
     * And Optionally Save Size & Content
     * @param {String} id 
     * @param {String} newType 
     * @param {Object} size 
     * @param {String | Object} content 
     */
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
    /**
     * Locally Saves Change in Size of Container
     * @param {Object} size 
     */
    changeContainerSizeLocal(size) {
        this.container = size
    },
    /**
     * Groups All the Ancestor of Given CardID :
     * - Pushes Ancestor in an Array
     * - Local Operation
     * @param {String} id 
     */
    groupCardsParent(id) {
        const currentCard = this.cards[id];
        if (currentCard.parent !== 'root') {
            this.cardGrouped.push(currentCard.parent);
            this.groupCardsParent(currentCard.parent);
        }
    },
    /**
     * Groups All the Childrens of Given CardID :
     * - Pushes Childrens in an Array
     * - Local Operation
     * @param {String} id 
     */
    groupCardsChildren(id) {
        const currentCard = this.cards[id];
        if (currentCard?.children) {
            Object.keys(currentCard.children)
                .forEach(id => {
                    this.cardGrouped.push(id);
                    this.groupCardsChildren(id);
                })
        }
    },
    /**
     * Updates the FOLLOWING property in Given user ID from FIREBASE 
     * @param {String} userId 
     */
    addUserFollow(userId) {
        console.log("ADDED USER FOLLOW", userId)
        // this.users[userId] = {
        //     ...this.users[userId] ,following: this.userID
        // }
        this.projectRef.child("users").child(userId)
            .update({ following: this.userID })
            .then(console.log(this.userID, " User Following ", userId))
            .catch(reason => console.log("Couldn;t follow because ", reason));
    },
    /**
     * Removes the FOLLOWING property in Given user ID from FIREBASE 
     * @param {String} userId 
     */
    removeUserFollow(userId) {
        console.log("REMOVED USER FOLLOW", userId)
        // this.users[userId] = {
        //     ...this.users[userId] ,following: null
        // }
        this.projectRef.child("users").child(userId)
            .update({ following: null })
            .then(console.log(this.userID, " User Following ", userId))
            .catch(reason => console.log("Couldn;t follow because ", reason));
    },
    /**
     * Makes ID of newParent to Child of Given card ID 
     * @param {String} id 
     * @param {String} newParent 
     * @param {*} strategy 
     */
    makeCardChild(id, newParent, strategy) {
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
    },
    /**
     * Reparents the Card of id with newParent
     * @param {String} id 
     * @param {String} newParent 
     * @param {*} strategy 
     */
    reparentCard(id, newParent, strategy) {
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

    },
    /**
     * Uploads the File to the Given upload Path With Metadata Along with it to FIREBASE STOREAGE 
     * @param {String} uploadPath - Path to Where upload 
     * @param {Blob} file - File that has to be upload
     * @param {Object} metadata - custom metadata of File
     * @param {Function} statusCallback - Fetch Uploading Status
     * @param {String} use - optional param to signify the use of uploaded file as
     */
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
    /**
     * Requests to Fetch the data of Uploaded file from the given path
     * @param {String} downloadPath - path where file is stored 
     * @param {Function} callback - callback of data of File
     */
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
    /**
     * upload the Profile Picture of Current User
     * @param {*} callback - Status of Upload
     */
    updateProfilePicture(callback) {
        const path = `root/profiles/${this.userID}/pfp/profilePic`;
        const requestedPathRef = storage().ref(path)
        requestedPathRef.getDownloadURL()
            .then((url) => {
                auth().currentUser.updateProfile({
                    photoURL: url
                })
                    .then(callback(true))
            })
            .catch((reason) => console.log("failed to fetch download URL for", path, "because", reason))
    },
    /**
     * Converts any card to Blank Card
     *  - NOTE : Provide Type to STORAGE RELATED CARDS (image , video etc) OR else Leave it  
     * @param {String} id - Card ID whose needs to be converted
     * @param {String} type - Optional Parameter for Storage Related Files
     */
    convertCardToBlank(id, type) {
        if (!type) {
            const pathToFile = this.cards[id].content.metadata.fullPath
            const ref = storage().ref(pathToFile);
            ref.delete().then(console.log("File Deleted")).catch(err => console.log("File Delete Error", err))
        }
        this.changeType(id, 'blank', { width: 275, height: 45 }, { text: '' });
    },
    /**
     * Invite Provided data of Email and Send Invitation through link
     * @param {*} data 
     */
    sendInviteEmail(data) {
        var sendLinkEmail = functions.httpsCallable('sendLinkEmail')
        return sendLinkEmail(data)
    },
    // update any property of store (for use with listeners)
    sync(property, path, value) {
        set(this[property], path, value)
    },
    /**
     * Sets Highlight Property to Searched Item results
     * @param {*} result - Search Result
     * @param {*} belongsTo 
     */
    highlightSearched(result, belongsTo) {
        if (belongsTo === 'projects' && result.length > 0)
            Object.entries(result).forEach(([_, val]) => {
                this.projects[val.id].highlight = true;
            })
    },
    /**
     * Generates Key For Sharing Project on Basis of permission in FIREBASE
     * @param {*} permission 
     */
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
    /**
     * Checks Whether Keys For Sharing is present or not
     * @returns {Boolean} If Key Exists
     */
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
    /**
     * Fetches the Key Generated at time of Sharing project
     */
    fetchKeys() {
        const keys = this.projectRef.child("sharing").once('value')
            .then((snapshot) => {
                return snapshot.val()
            })
            .catch((err) => console.log(err))
        return keys
    },
    /**
     * Remove Current User Sharing Property from project 
     * @returns {Boolean}
     */
    removeKey() {
        const keys = this.projectRef.child("sharing").remove()
            .then(() => {
                console.log("Removed")
            })
            .catch((err) => console.log(err))
        return keys
    },
    /**
     * Creates the Project Base with Permission associated to it.
     * By the verification of KeyID that was generated at time of Sharing 
     * @param {String} projectID 
     * @param {String} keyId 
     * @param {String} permission 
     * @param {Function} callback 
     */
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
    /**
     * Locally Adds 'isCollapse' Property to given card id
     * @param {String} id 
     * @param {String} strategy - for Main Card to show as Collapsed Card
     */
    collapseCard(id, strategy) {
        strategy ? this.collapsedID[id] = strategy : this.cards[id]["isCollapse"] = true;
    },
    /**
     * Locally removes 'isCollapse' Property to given card id
     * @param {String} id 
     * @param {String} strategy - for Main Card to show as Expanded Card
     */
    expandCard(id, strategy) {
        strategy ? this.collapsedID[id] = null : this.cards[id]["isCollapse"] = null;
    },
    /**
     * Adds 'editing' Property to the given card id 
     * - Use to check which card is using by whom
     * - FIREBASE operation
     * @param {String} id 
     */
    addUserEditing(id) {
        this.projectRef.child('nodes').child(id).child("editing")
            .set({ [this.userID]: servertime })
            .then(console.log("this user is editing card", id))
            .catch(error => console.log("error raised in addUserEditing because ", error))
    },
    /**
     * Removes 'editing' Property to the given card id
     * @param {*} id 
     */
    removeUserEditing(id) {
        this.projectRef.child('nodes').child(id).child("editing")
            .set(null)
            .then(console.log("This User is Now Not Editing"))
            .catch(error => console.log("Error raised in addUserEditing because ", error))
    },
    /**
     * Update 'joinedCall' Property in current User when Joined Call
     * @param {Object} info 
     */
    addUserCallInfo(info) {
        this.projectRef.child('users').child(this.userID)
            .update({ joinedCall: true }) //TODO: can add speaking Feature
            .then(console.log("This User has Joined Call"))
            .catch(error => console.log("Error raised in addUserCallInfo because ", error))
    },
    /**
     * Remove 'joinedCall' Property in current User when Call is Disconnected
     * @param {Object} info 
     */
    removeUserCallInfo(info) {
        this.projectRef.child('users').child(this.userID)
            .update({ joinedCall: null })
            .then(console.log("This User has Not Joined Call"))
            .catch(error => console.log("Error raised in removeUserCallInfo because ", error))
    },
    //---------------------_SHORTCUT KEYS FUNCTIONS -------------------
    /**
     * Execute Shortcut w.r.t to each Functions
     * @param {String} shortcut 
     */
    runShortCutKey(shortcut) {
        switch (shortcut) {
            case 'ctrl+a':
                this.selectAllCards();
                break;
            case 'delete':
                this.removeSelectedCards();
                break;
            case 'backspace':
                this.removeSelectedCards();
                break;
            case 'ctrl+q':
                //Duplicates the Selected Cards
                this.duplicateCards();
                break;
            case 'alt+r':
                //Removes Selected Duplicate
                this.removeDuplicates();
                break;
            case 'ctrl+alt+r':
                //Removes All Duplicates Without Selection
                this.removeDuplicates('removeAll');
                break;
            case 'ctrl+alt+n':
                if (!this.currentActive && this.cursors && this.cursors[this.userID])
                    this.addCard(
                        { x: this.cursors[this.userID].x, y: this.cursors[this.userID].y },
                        { width: 275, height: 45 }, "root", "blank"
                    )
                break;
            default: break;
        }
    },
    /**
     * Select ALL Cards 
     * @param {*} strategy - IF a Particular Card to De-select 
     */
    selectAllCards(strategy) {
        Object.entries(this.cards)
            .filter(([id, value]) => id && id !== "root" && (strategy || !value?.isCollapse))
            .forEach(([id, value]) => {
                if (strategy) {
                    this.removeCard(id, "reparent", value.parent)
                }
                else if (!this.selectedCards.includes(id))
                    this.selectedCards.push(id);
            })
    },
    /**
     * Removes Selected Card From 'selectedCards' Array
     */
    removeSelectedCards() {
        if (this.selectedCards.length) {
            this.selectedCards.forEach(id => {
                this.removeCard(id, "reparent", this.cards[id].parent)
            })
            this.selectedCards = [];
        }
    },
    /**
     * Duplicates Selected Cards with maintaining the relationship between them
     */
    duplicateCards() {
        if (this.selectedCards.length) {
            this.selectedCards.forEach(id => {
                const me = this.cards[id];
                const parent = this.cards[me.parent];
                let newCardKey = this.projectRef.child("nodes").push().key;
                this.addCard(
                    { x: me.position.x + me.size.width + 80, y: me.position.y },
                    { height: me.size.height, width: me.size.width }
                    , parent?.originalOf || me.parent
                    , me.type,
                    (newCardId) => {
                        console.log("COMPARE ", newCardKey === newCardId)
                        this.saveContent(newCardId, me.content);
                    }, newCardKey
                )
                this.saveContent(newCardKey, me.content);
                this.addCardProperty(id, { originalOf: newCardKey });
                this.addCardProperty(newCardKey, { duplicate: id });
            })
        }
    },
    /**
     * Removes Duplicate Cards
     * @param {*} strategy 
     */
    removeDuplicates(strategy) {
        if (strategy) {
            Object.entries(this.cards)
                .filter(([id, value]) => id && id !== "root" && (value?.originalOf || !value?.duplicate))
                .forEach(([id, value]) => {
                    if (value.originalOf) {
                        this.removeCard(value.originalOf, "reparent", value.parent)
                    }
                    else if (value.duplicate) {
                        this.removeCard(id, "reparent", value.parent);
                    }
                })
        }
        else if (this.selectedCards.length) {
            this.selectedCards.forEach(id => {
                let indexOf;
                const me = this.cards[id]
                console.log(this.cards[id])
                if (me?.originalOf) {
                    this.removeCard(me?.originalOf, "reparent", me.parent)
                }
                else if (me?.duplicate) {
                    this.removeCard(id, "reparent", me.parent);
                    indexOf = this.selectedCards.indexOf(id);
                }
                if (indexOf)
                    this.selectedCards.splice(indexOf, 1);
            })
        }
    },
    generateTask() {
        let newCardKey = this.tasksRef.push().key;
        this.tasksRef.child(newCardKey)
            .set({
                height:124,
                creator:this.userID,
                content: {
                    // tag: [],
                    task1: {
                        text:'',
                        status:'initialized'
                    }
                }
            })
            .then(() => console.log('Added Task'))
            .catch((err) => console.log("Could not created task because ", err));
    },
    updateTask(taskID , userID , updates){
        this.tasksRef.child(taskID)
            .update(updates)
            .then(() => console.log('Task Updated',updates))
            .catch((err) => console.log("Could not update task because ", err));
    },
    /*
    updateTask(taskID, userID, updates) {
        this.tasks[taskID]["content"]=updates;
        console.log('Task Updated',taskID,updates)
        // this.tasksRef.child(taskID).child('content')
        //     .update(updates)
        //     .then(() => console.log('Task Updated', updates))
        //     .catch((err) => console.log("Could not update task because ", err));
    },
    saveTask(taskID,updates) {
        this.tasksRef.child(taskID)
            .update(this.tasks[taskID])
            .then(() => console.log('Task Saved', this.tasks[taskID]))
            .catch((err) => console.log("Could not update task because ", err));
    },
     */
    removeTask(id) {
        this.tasksRef.child(id)
            .set(null)
            .then(console.log("Removed Task", id))
            .catch((err) => console.log("Didn't removed because", err))
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
            database.ref("users").child(this.userID).child("version").once('value').then((snap) => {
                if (!snap.val()) {
                    window.open("https://www.notion.so/What-s-new-092596fca8574cea99de90d4f61ef4fd", '_blank')
                    database.ref("users").child(this.userID).child("version").set("2")
                }
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
        this.projectRef.child("tasks").on("child_added", (snap) => this.tasks[snap.key] = snap.val());
        this.projectRef.child("tasks").on("child_changed", (snap) => this.tasks[snap.key] = snap.val());
        this.projectRef.child("tasks").on("child_removed", (snap) => delete this.tasks[snap.key]);
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
        analytics.logEvent('action_performed');
        let card = this.cards[id]
        let addCard = this.addCard
        let saveContent = this.saveContent
        let projectId = this.projectID
        let projectRef = this.projectRef
        let requestDownload = this.requestDownload

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
                                let content = json.sm_api_content?.split("[BREAK]").map((line) => "- " + line)
                                saveContent(newID, { text: content.join(" ") })
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
                            let content = fullCap?.split("[BREAK]").map((line) => line)
                            saveContent(newID, { text: content.join(" ") })
                        })
                })
                .then(() => callback(true))
                .catch(() => callback(false))
        }
        function convFile() {
            var convToPdf = functions.httpsCallable('fileConv')
            //let newCardKey = projectRef.child("nodes").push().key;
            //var tempPath = `root/${projectId}/${newCardKey}/`
            const customMetadata = card.content.metadata.customMetadata

            const data = {
                fullpath: card.content.metadata.fullPath,
                //outPath: tempPath,
                //fileName: card.content.metadata.name,
                outformat: "pdf",
                updateMetadata: {
                    metadata: {
                        [Object.keys(customMetadata)[0]]: customMetadata[Object.keys(customMetadata)[0]],
                    }
                }
            }
            convToPdf(data)
                .then((status) => {
                    console.log(status)
                    if (status.data !== 'finished' && status.data !== null) {
                        alert("File could not be converted")
                    }
                    // else {
                    //     console.log(`Path: ${newCardKey}/${card.content.metadata.name}`)
                    //     requestDownload(`${newCardKey}/${card.content.metadata.name}`, (url, metadata) => {
                    //         console.log("reqDownData", url, metadata)
                    //         addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                    //             {
                    //                 height: 50,
                    //                 width: 250
                    //             }, id
                    //             ,
                    //             "file",
                    //             (newID) => {
                    //                 saveContent(newID, {
                    //                     url: url,
                    //                     metadata: metadata
                    //                 })
                    //             })
                    //     })
                    //     console.log(`${tempPath}${card.content.metadata.name}`)
                    //     storage().ref(`${tempPath}${card.content.metadata.name}`).delete()
                    //         .then(() => console.log("deleted temp file"))
                    //         .catch((e) => console.log("Deletion Error: ", e))
                    // }
                    callback(true)
                }).catch(() => callback(false))
        }
        function convertLinksToCitation(citestyle) {
            var fullText = []
            var convToCite = functions.httpsCallable('linkToCitationTest')
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
                style: citestyle
            }
            console.log("links data: ", linksData)
            convToCite(linksData)
                .then((output) => {
                    console.log("cite out: ", output)
                    addCard({ x: card.position.x + 50, y: card.position.y + card.size.height + 100 },
                        { height: 200, width: 400 },
                        id,
                        "text",
                        (newID) => {
                            saveContent(newID, { text: output.data })
                        })
                    callback(true)
                })
                .catch(() => callback(false))
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
        if (name === "convToApaCitation") {
            convertLinksToCitation("apa")
        }
        if (name === "convToHarCitation") {
            convertLinksToCitation("harvard1")
        }
        if (name === "convToVanCitation") {
            convertLinksToCitation("vancouver")
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
            types: ["link"],
            icon: require("../assets/actions/icons/summarize.svg")
        },
        "getYtCaptions": {
            id: "getYtCaptions",
            title: "Extract subtitles from a Youtube video",
            description: "extracts available closed captions from a Youtube video",
            types: ["VideoLink"],
            icon: require("../assets/actions/icons/getYtCaptions.svg")
        },
        "convFile": {
            id: "convFile",
            title: "Convert file to PDF",
            description: "converts your file to pdf format",
            types: ["file"],
            icon: require("../assets/actions/icons/convFile.svg")
        },
        "convToApaCitation": {
            id: "convToApaCitation",
            title: "Generate APA style citations",
            description: "generates citations for all the research publication links in your text",
            types: ["text"],
            icon: require("../assets/actions/icons/convertLinksToCitation.svg")
        },
        "convToHarCitation": {
            id: "convToHarCitation",
            title: "Generate Harvard style citations",
            description: "generates citations for all the research publication links in your text",
            types: ["text"],
            icon: require("../assets/actions/icons/convertLinksToCitation.svg")
        },
        "convToVanCitation": {
            id: "convToVanCitation",
            title: "Generate Vancouver style citations",
            description: "generates citations for all the research publication links in your text",
            types: ["text"],
            icon: require("../assets/actions/icons/convertLinksToCitation.svg")
        },
        "convertImageToBW": {
            id: "convertImageToBW",
            title: "Convert image to grayscale",
            description: "converts an image to grayscale",
            types: ["image"],
            icon: require("../assets/actions/icons/convertImageToBW.svg")
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
            title: "More templates coming soon!",
            description: "Tell us what you want to see by giving feedback."
        }
    },
    templatesUI: {
        selectedTemplate: null
    }
}