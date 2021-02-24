import projectTemplates from "../../constants/projectTemplates";
const { database, servertime } = require("../../services/firebase");

/**
 * Creates New Projects & Setup Project-BASE 
 * @param {*} callback - Callback for project setup
 * @param {String} tempId - ID to Which Kind of Project to setup (Blank is default)
 * @param {*} projectName - Provide Name to project (Optional) 
 */
function addNewProject(callback, tempId, projectName) {
    const thumbnails = [require("../../assets/1.webp"), require("../../assets/2.webp"), require("../../assets/3.webp"), require("../../assets/4.webp")]
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
}
/**
 * Deletes Project of corresponding ID
 * - Goes in Garbage Collection 
 * @param {String} id 
 */
function deleteProject(id) {
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
}
/**
 * Rename Project Locally
 * @param {String} title 
 */
function localRenameProject(title) {
    this.projectMetadata.name = title
}
/**
 * Updates the updated Name of Project to Firebase
 * @param {String} id 
 * @param {String} title 
 */
function renameProject(id, title) {
    database.ref("documents").child(id).child("metadata").child("name").set(title)
}
/**
* Filter's the Project According to Search Result
* @param {Object} searchResult - Containes 'matches as property' which is array of matched Items  
*/
function filterProject(searchResult) {
    this.filteredProjectID = []
    if (searchResult.matches.length > 0)
        for (let i = 0; i < searchResult.matches.length; i++) {
            const match = searchResult.matches[i];
            //if(match.score > searchResult.matches.length)
            this.filteredProjectID.push(match.id);
        }
    else
        this.filteredProjectID = [];
}
/**
 * Starred the Projects and Saves to Firebase
 * @param {String} id 
 */
function starredThisProject(id) {
    console.log(this.projects[id].users[this.userID].name)
    database.ref("documents").child(id)
        .child(`users/${this.userID}/isStarred`)
        .set(true).then(console.log(id, " This Project is starred in USERS"))
        .catch(err => console.log("Error in setting Starred ", err));
}
/**
 * Un-Starred the Projects and Saves to Firebase
 * @param {String} id 
*/
function unStarredThisProject(id) {
    database.ref("documents").child(id)
        .child(`users/${this.userID}/isStarred`)
        .set(null).then(console.log(id, " This Project is starred in USERS"))
        .catch(err => console.log("Error in setting Starred ", err));
}
/**
 * Sets Project ID to Store Object For Global Access
 * @param {String} newProjectID 
 */
function setProjectID(newProjectID) {
    this.projectID = newProjectID;
    if (this.projectID) this.addDocumentListeners();
    else this.removeDocumentListeners();
}
export {
    filterProject,
    starredThisProject,
    unStarredThisProject,
    addNewProject,
    deleteProject,
    localRenameProject,
    renameProject,
    setProjectID
}