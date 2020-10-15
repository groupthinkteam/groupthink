
import React ,{useEffect,  useState} from 'react';
import { firebaseDB } from '../../services/firebase';
import MiniSearch from 'minisearch';
import InlineTextEdit from '../InlineTextEdit/InlineTextEdit';
import Button from '../Button/Button';
import {Modal } from "react-bootstrap"
import DisplaySearchedCards from './DisplaySearchedCards';
import { searchElementinDocuments } from '../../constants/searchTemplate';
const SearchBar = (props) => {
    const [cards, setCards] = useState({});
    const [searchResult,setSearchResult] = useState();
    const [show , setShow] = useState(false);
    useEffect(
        () => {
            const ref = firebaseDB.ref("users/" + props.currentUser.uid + "/projects/");
            ref.on('value', (snapshot) => {
                console.log("Menu Bar Listener to cards", snapshot.val());
                setCards(snapshot.val());
                
            })
            return () => ref.off('value');
        }, 
    [props])
    const handleShow = () => setShow(true);
    const handleClose = () =>{ setShow(false); setSearchResult();}
    const searchElemnt = (text) =>{
        const results = searchElementinDocuments(text,cards,['content.name'])
        setSearchResult(results);
        console.log("THE SEARCH ELEMENTS ",results , text);
    }
    return (
        <>
            <Button className={props.buttonClassName} handleClick={handleShow}>
                Search
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Search Project
                        <InlineTextEdit 
                            borderColor='black'
                            onChange={(e) => searchElemnt(e.target.value)}
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {
                            searchResult != undefined &&  Object.keys(searchResult).length >0 ?
                            Object.entries(searchResult).map(([key,val])=>{
                                return(
                                    <DisplaySearchedCards id={val.id} card={cards[val.id]} />
                                )
                            })
                            : <p>Nothing to Show</p>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button className="custom_btn" handleClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            
            
        </>
    )
}
export default React.memo( SearchBar);