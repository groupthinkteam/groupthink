import React from "react";
import { Rnd } from "react-rnd";
import NodeCard from "../DocumentCanvas/Cards/GenericCard"
import Button from "../Button/Button"

export default function CardContainer(props) {
    return (
        <div className="node-container" style={props.container}>
            <Button handleClick={props.addNode}>Add new node</Button>
            {Object.entries(props.cards).map(
                ([id, value]) => {
                    return (
                        <Rnd
                            dragHandleClassName="node-handle"
                        >
                            <NodeCard 
                            id={id} 
                            value={value.content} 
                            onContentChange={(id, content) => { console.log(id, content) }} 
                            onMove={props.onMove} 
                            onDelete={props.onDelete} />
                        </Rnd>
                    )
                }
            )}
        </div>
    )
}