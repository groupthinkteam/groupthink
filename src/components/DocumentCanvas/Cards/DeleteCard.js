import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../Button/Button';

const DeleteCard = (props) =>
{
    const [show, setShow] = useState(false);
    const [option , setOption] = useState();
    const [select,setSelect] =useState(false)
    const handleShow = () =>  setShow(true);
    const handleClose = () => {
        setShow(false);
        setOption();
    }
    const deleteCard = (operation) => props.deleteCard(operation);
    const selectedOption =() =>
    {
        if(option === 'delWithChild')
        {
            deleteCard('delete with child');
        }
        else if(option === 'child_to_project')
        {
            console.log('child_to_project');
            deleteCard('delete and Reparent Root')
        }
        else
        {
            console.log('select_other_parent');
            props.showOption();
            setSelect(true);
            props.reparent(props.id);
            handleClose();
        }
    }
    //---TODO Check this Log---
    //console.log(props.CardDetail?.children)
    return(
        <>
            <div>            
                <Button className={props.className} handleClick={handleShow}>X</Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>What do you want to delete?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Please Select Options :
                            <br/>
                            <input type="radio" name="delete_card" value="delWithChild" onChange={e=> setOption(e.target.value)} required={true}/>
                            <label htmlFor="whole_card">To Delete Card With It's Child?</label>
                            <br/>
                            <input type="radio" name="delete_card" value="child_to_project" onChange={e=> setOption(e.target.value)} required={true}/>
                            <label htmlFor="child_to_project">To Delete Only Selected Card {`&`} Reparent Child's to Root?</label>
                            <br/>
                            <input type="radio" name="delete_card" value="select_other_parent" onChange={e=> setOption(e.target.value)} required={true}/>
                            <label htmlFor="select_other_parent">To Delete Card {`&`} Reparent It's Child to Selected Parent?</label>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="custom_btn" handleClick={handleClose}>Close</Button>
                            {
                                option != undefined ?
                                <Button className="custom_btn" handleClick={selectedOption}>Save Changes</Button>
                                :<div/>
                            }
                        </Modal.Footer>
                    </Modal>  
                
            </div>
        
        </>
    )
}

export default DeleteCard;