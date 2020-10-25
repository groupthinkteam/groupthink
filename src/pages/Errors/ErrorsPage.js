import React from 'react';
import { useLocation } from "react-router-dom";
export default function ErrorsPage()
{
    const location =useLocation();
    
    return(
        <div>
            Invalid Link Enter :- 
            <br/>
            {
               location.state.from.pathname
            }
        </div>
    )
}