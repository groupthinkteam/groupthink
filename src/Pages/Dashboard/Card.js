import React, {useState} from "react"
//import Button from "../../components/Button/Button"
import InlineTextEdit from "../../components/InlineTextEdit/InlineTextEdit"

import "../../styles/ProjectCard.scss"
import { Card as BootCard ,Button as BootButton, Form } from "react-bootstrap"

export default function Card(props) {
    let [state,setState] = useState({});
    const onHandler = () => {
       // setState({selectedFile:event})
        const data = new FormData();
        data.append('file',state.file);
        console.log("FORM DATA",data)
        fetch('http://localhost:5001/groupthink-fc4b2/us-central1/NodeUploadJSON',{
            method: 'POST',
            // /headers : {"Content-Type":"application/json"},
            body:{file:"ds"}  
        })
        .then((success)=>{
            console.log("File Uploaded",success.body);
        })
        .catch(err=> console.log(err));
    }
    const uploadFile = (file) => {
        
    }
    if (props.addNew) {
        return (
            <>
            <div className="project-card">
                <BootButton onClick={props.onAddNew} variant='outline-dark'>
                    Add New Card
                </BootButton>
            </div>
            <div className="project-card">
                
                <form 
                    action="http://localhost:5001/groupthink-fc4b2/us-central1/NodeUploadJSON" 
                    method="post" 
                    encType="multipart/form-data"
                >
                    Select image to upload:
                    <input type="file" name="fileToUpload" id="fileToUpload"/>
                    <input type="submit" value="Upload Image" name="submit"/>
                </form>
            </div>
            </>
        )
    }
    else return (
        <div className="project-card">
            
            <BootCard style={{width:'200px',height:'300px'}}>
                <BootCard.Img onClick={() => props.onOpen(props.id,props.card.thumbnailURL)}
                src={props.card.thumbnailURL}
                alt="project thumbnail"
                 />
                <InlineTextEdit
                    className="project-card-item"
                    text={props.card.name}
                    onSave={(text) => props.onSave(props.id, text)}
                />
                <BootButton
                   variant="outline-danger"
                   className="project-card-item"
                   onClick={() => props.onDelete(props.id)}
                >
                    Delete
                </BootButton>
                
            </BootCard>
        </div>
    )
}
/**
 * <Form >
                <Form.File
                        id="custom-file"
                        label="Custom file input"
                        custom={true}
                        type='file'
                        name='file'
                        enctype = "multipart/form-data"
                        formAction="http://localhost:5001/groupthink-fc4b2/us-central1/NodeUploadJSON"
                        method="post" 
                        onChange={(event)=>{setState({file:event.target.files[0]})}}
                    />
                     
                    <BootButton variant="outline-success" onClick={onHandler}>Send Back</BootButton>
                    
                </Form>
 * <Form.File
                        id="custom-file"
                        label="Custom file input"
                        custom={false}
                        type='file'
                        onChange={event=>onHandler(event)}
                    />
 * <img
                onClick={() => props.onOpen(props.id,props.card.thumbnailURL)}
                src={props.card.thumbnailURL}
                alt="project thumbnail" />
            <InlineTextEdit
                className="project-card-item"
                text={props.card.name}
                onSave={(text) => props.onSave(props.id, text)} />
            <Button
                className="project-card-item"
                handleClick={() => props.onDelete(props.id)}>
                Delete
            </Button>
 */