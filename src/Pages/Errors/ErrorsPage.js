import React from 'react';
import {useLocation} from "react-router-dom";
/**
 * This Component Display The Error Getting in Invitation Link
 * At Path `/errors`
 * @component
 */
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