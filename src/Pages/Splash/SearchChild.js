import { firebaseDB } from "../../services/firebase";
import { auth } from "firebase"

const isChild = async (child) => {
    const isChild = await firebaseDB.ref(`users/${auth().currentUser?.uid}/projects/`).once('value').then(snap => snap.hasChild(child).valueOf())
    return isChild;
}
export default isChild;