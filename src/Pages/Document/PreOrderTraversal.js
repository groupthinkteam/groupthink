import React,{useState} from 'react'

const PreOrderTra = (projectId) => 
{
    let [state, setState] = useState(
        { arr :
            {
                left : [] ,
                right : []
            }
        }
    );
    const appendToLeft = (data) => 
    {
        setState({arr : {left : state.arr.left.push(data)}}) 
    }
    const appendToRight = (data) => 
    {
        setState({arr : {right : state.arr.right.push(data)}}) 
    }
    
}