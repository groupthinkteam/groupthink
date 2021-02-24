import { database, auth } from "../services/firebase"
import "mobx-react-lite"
import { FIREBASE_CONSTANTS } from "../constants/firebaseConstants"
import {
    addCard,
    removeCard,
    runShortCutKey,
    selectAllCards,
    removeSelectedCards,
    duplicateCards,
    removeDuplicates,
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
    isProjectValid,
    addColorsToCards,
    addToRecentSearch,
    changePosition,
    changeSize,
    changeContent,
    formatText,
    changeContainerSizeLocal,
    groupCardsParent,
    groupCardsChildren,
    collapseCard,
    expandCard,
    sync,
    highlightSearched,
    addDocumentListeners,
    removeDocumentListeners,
    addCursorListener,
    removeCursorListener,
    sendInviteEmail,
    addKeyToShare,
    checkKeys,
    fetchKeys,
    removeKey,
    createSharedUser,
    addNewProject,
    deleteProject,
    localRenameProject,
    renameProject,
    filterProject,
    starredThisProject,
    unStarredThisProject,
    setProjectID,
    makeCardChild, reparentCard,
    requestUpload, requestDownload, updateProfilePicture, convertCardToBlank,
    addDashboardListeners, removeDashboardListeners, addWelcomeIfNotExists,
    runAction, useTemplate, action, templates,
    throttleFunction
} from "./allFuntionExport"

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
    taskEditing: null,
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

    //------------------------------------ DASHBOARD RELATED ACTIONS ----------------------------------
    addNewProject,
    deleteProject,
    localRenameProject,
    renameProject,
    setProjectID,
    filterProject,
    starredThisProject,
    unStarredThisProject,
    //------------------------------------------END : dashboard related actions ----------------------------------

    //------------------------------------------ START: DOCUMENT RELATED ACTIONS ---------------------------------

    //---------------------- GENERIC OPERATION -----------------------
    addCard,
    removeCard,
    //------------------------------ LOCAL OPERATION------------------------------
    addColorsToCards,
    addToRecentSearch,
    changePosition,
    changeSize,
    changeContent,
    formatText,
    changeContainerSizeLocal,
    groupCardsParent,
    groupCardsChildren,
    collapseCard,
    expandCard,
    sync,
    highlightSearched,
    //------------------------------ END :- LOCAL OPERATION ----------------------

    //------------------------------ FIREBASE / BACKEND OPERATION ----------------
    addCardProperty,
    saveCardColors,
    getActionQuery,
    isProjectValid,
    savePosition,
    resize,
    saveContainerSize,
    changeType,
    addUserFollow,
    removeUserFollow,
    addUserEditing,
    removeUserEditing,
    addUserCallInfo,
    removeUserCallInfo,
    generateTask,
    updateTask,
    removeTask,
    //--------------------------END :- FIREBASE / BACKEND OPERATION ------------

    //--------------------------- CARD ACTIONS --------------------
    runAction,
    actionsList: action.actionsList,
    actionsUI: action.actionsUI,

    //-------------------------- PROJECT TEMPLATE ----------------
    useTemplate,
    templatesList: templates.templatesList,
    templatesUI: templates.templatesUI,

    //-----------------------THROTTLE FUNCTION ----------

    saveCursorPosition: throttleFunction.saveCursorPosition,
    updateLastActive: throttleFunction.updateLastActive,
    saveContent: throttleFunction.saveContent,

    //------------------------- ARROW OPERATION----------------------
    makeCardChild,
    reparentCard,

    //----------------------- STORAGE OPERATION -----------------
    requestUpload,
    requestDownload,
    updateProfilePicture,
    convertCardToBlank,
    //-----------------------  END :- STORAGE OPERATION ------------

    //---------------------- PROJECT SHARING ---------------
    sendInviteEmail,
    addKeyToShare,
    checkKeys,
    fetchKeys,
    removeKey,
    createSharedUser,
    //---------------------- END :- PROJECT SHARING -------------

    //-----------------------------_SHORTCUT KEYS FUNCTIONS -------------------
    runShortCutKey,
    selectAllCards,
    removeSelectedCards,
    duplicateCards,
    removeDuplicates,
    //----------------------------- END :- SHORT KEY FUNCTION ---------------------------


    // -------------------------------- END :- DOCUMENT MANIPULATION OPERATION / FUNCTIONS -------------------


    //------------------------------ LISTNER MANIPULATION ---------------------------
    addDashboardListeners,
    removeDashboardListeners,
    addWelcomeIfNotExists,
    addDocumentListeners,
    addCursorListener,
    removeDocumentListeners,
    removeCursorListener,
    //------------------------------- END :- LISTNER MANIPULATION -----------------
    // auth related actions
    signout() {
        auth().signOut()
    }
}