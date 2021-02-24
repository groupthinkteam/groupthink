const { database, storage ,auth } = require("../../services/firebase");

function addDashboardListeners(forceRefreshCallback) {
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
}
function addWelcomeIfNotExists(forceRefreshCallback) {
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
}
function removeDashboardListeners() {
    if (this.userID.length > 1) {
        this.userRef.off();
        Object.keys(this.projects)
            .forEach((key) => {
                database.ref("documents").child(key).child("metadata").off();
                database.ref("documents").child(key).child("users").off()
            })
    }
}

export { addDashboardListeners , removeDashboardListeners , addWelcomeIfNotExists}