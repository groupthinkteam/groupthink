import React , {useState} from 'react';
import {Card,Form,Button} from "react-bootstrap";
import './DocumentCard.scss';
const DocumentCard = (props) => {
    
    let [state ,setState] = useState({
        text : '',
        updated_text : ''
    })
    const propWritetoDB = (refURL,text) =>()=>{
        console.log('Send back data to Write',refURL,text);
        props.sendWriteToDB(refURL,text);

    }
    const propDeletetoDB = (refURL,title,id) =>()=>{
        console.log('Send back data to Delete',refURL,title);
        props.sendDeleteToDB(refURL,title,id);
    }
    const propUpdatetoDB = (refURL,id,text) =>()=>{
        console.log('Send back data to Update',refURL,text);
        props.sendUpdateToDB(refURL,id,text);
    }
    if(props.type === 'parent')
    {
        return(
            <>
                <div className="project-card">
                    <div className="project-card-title">
                        {props.title}
                        <Form onSubmit={propWritetoDB(props.nodePath ,{title:state.text} )} className="mt-2" >
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control className="mb-2" type="id" placeholder="Enter Project Name" onChange={event=>setState({text:event.target.value})}/>
                            <Button variant="primary" type="submit" className="mt-3"> 
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </>
        )
    }
    else
    {
        return(
            <div className="project-card" >    
                <div className="project-card-title">
                    {props.title}
                </div>
                <div className="project-card-content">
                  <b> Content : </b> {props.content}
                </div>
            </div>
        )
        
    }
}
export default DocumentCard;