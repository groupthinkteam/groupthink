function addDocumentListeners() {
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
}

function removeDocumentListeners() {
    this.projectRef.child("users").off();
    this.projectRef.child("nodes").off();
    this.projectRef.child("container").off();
    this.projectRef.child("metadata").off();
    this.projectRef.child("tasks").off();
    this.cards = {}
    this.users = {}
    this.cursors = {}
    this.container = {}
    this.tasks = {}
    this.documentLoadPercent = 0
}

function addCursorListener() {
    this.projectRef.child("cursors").on('value', (snap) => this.cursors = snap.val());
}

function removeCursorListener() {
    this.projectRef.child("cursors").off()
}

export {
    addDocumentListeners,
    removeDocumentListeners,
    addCursorListener,
    removeCursorListener
}