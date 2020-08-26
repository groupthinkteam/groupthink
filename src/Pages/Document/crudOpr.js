import { firebaseDB } from "../../services/firebase";


export const readFROMDB = (refURL , callback  ) => {
        firebaseDB.ref(refURL).on('value' ,snap=>{
                callback(snap.val())
        });         
}
export const writeToDB = (path,text) =>
{
        //console.log("path",path)
        firebaseDB.ref(path).push(text).then(console.log("Succes to Write"));
        //---- Reload Window --------
}
export const deleteFromDB = (path,title , id) =>
{
        console.log("DELETE METHOD", path , title ,id)
        alert(`Do You Want to Delete ${title}`);
        firebaseDB.ref(path+'/'+id).remove();
}
export const updateTheDB = (path,id,text) => 
{
        var up = {};
        console.log("Update METHOD",path,id,text);
        up[id]=text;
        firebaseDB.ref(path).update(up);
}  