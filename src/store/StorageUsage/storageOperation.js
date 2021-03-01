const { storage, auth } = require("../../services/firebase")

/**
 * Uploads the File to the Given upload Path With Metadata Along with it to FIREBASE STOREAGE 
 * @param {String} uploadPath - Path to Where upload 
 * @param {Blob} file - File that has to be upload
 * @param {Object} metadata - custom metadata of File
 * @param {Function} statusCallback - Fetch Uploading Status
 * @param {String} use - optional param to signify the use of uploaded file as
 */
function requestUpload(uploadPath, file, metadata, statusCallback, use) {
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
}
/**
 * Requests to Fetch the data of Uploaded file from the given path
 * @param {String} downloadPath - path where file is stored 
 * @param {Function} callback - callback of data of File
 */
function requestDownload(downloadPath, callback) {
    const path = "root/" + this.projectID + "/" + downloadPath;
    let requestedPathRef = storage().ref(path)
    requestedPathRef.getDownloadURL()
        .then((url) => {
            requestedPathRef.getMetadata()
                .then((metadata) => callback(url, JSON.parse(JSON.stringify(metadata))))
                .catch((reason) => console.log("failed to fetch metadata for", path, "because", reason))
        })
        .catch((reason) => console.log("failed to fetch download URL for", path, "because", reason))
}
/**
 * upload the Profile Picture of Current User
 * @param {*} callback - Status of Upload
 */
function updateProfilePicture(callback) {
    const path = `root/profiles/${this.userID}/pfp/profilePic`;
    const requestedPathRef = storage().ref(path)
    requestedPathRef.getDownloadURL()
        .then((url) => {
            auth().currentUser.updateProfile({
                photoURL: url
            })
                .then(callback(url))
        })
        .catch((reason) => console.log("failed to fetch download URL for", path, "because", reason))
}
/**
 * Converts any card to Blank Card
 *  - NOTE : Provide Type to STORAGE RELATED CARDS (image , video etc) OR else Leave it  
 * @param {String} id - Card ID whose needs to be converted
 * @param {String} type - Optional Parameter for Storage Related Files
 */
function convertCardToBlank(id, type) {
    if (!type) {
        const pathToFile = this.cards[id].content.metadata.fullPath
        const ref = storage().ref(pathToFile);
        ref.delete().then(console.log("File Deleted")).catch(err => console.log("File Delete Error", err))
    }
    this.changeType(id, 'blank', { width: 275, height: 45 }, { text: '' });
}
export {
    requestUpload,
    requestDownload,
    updateProfilePicture,
    convertCardToBlank
}