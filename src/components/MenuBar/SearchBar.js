import React ,{useEffect,  useState , useContext} from 'react';
import { firebaseDB } from '../../services/firebase';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import Button from '../Button/Button';
import {Modal } from "react-bootstrap";
import { searchElementinDocuments } from '../../constants/searchTemplate';
import { ResultContext } from '../../Pages/Document/Document';
import { DataContext } from '../../Pages/Dashboard/Dashboard';

/**
 * This Bar Do Search Operation and Return the Result to Context Provider
 * @param {*} props 
 */
const SearchBar = (props) => {
    const [cards, setCards] = useState({});
    const {setDocumentResult ,nodes } = useContext(ResultContext);
    const {setResultCards,cardsDashboard} = useContext(DataContext);
    console.log("NODES ",nodes , cardsDashboard)
    useEffect(
        () => {
            const ref = firebaseDB.ref("users/" + props.currentUser.uid + "/projects/");
            const projectRef = firebaseDB.ref("documents/" + props.projectID + "/");
            ref.on('value', (snapshot) => {
                console.log("Menu Bar Listener to cards", snapshot.val());
                setCards(snapshot.val());
                
            })
            return () => {
                ref.off('value');
            };
        }, 
    [props])
    const searchElemnt = (text ) =>{
        let results ;
        if(props.dashboard)
        {
            results = searchElementinDocuments(text,cards,['content.name'])
            setResultCards(results);
            console.log(results)
        }
        else if(props.document && nodes != undefined )
        {
            results = searchElementinDocuments(text,nodes,['content.text' , 'fileName' ,  'title' , 'content.url'])
            setDocumentResult(results);
        }
    }
    return (
        <>
            
                <InlineTextEdit
                placeholder = 'Search Here .....'
                borderColor='black'
                onChange={(e) => searchElemnt(e.target.value)}
                />
                   
              
        </>
    )
}
export default React.memo( SearchBar);