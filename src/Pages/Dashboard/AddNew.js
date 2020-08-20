import React from "react"
import Button from "../../components/Button/Button"

export default function AddNew(props) {
    // console.log(props)
    return (
        <div style={{ border: '2px solid black' }}>
            <Button handleClick={props.onAddNew}>
                Add New Card
            </Button>
        </div>
    )
}