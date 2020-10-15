import React,{useContext} from 'react';
import { ResultContext } from '../../Pages/Document/Document';
import "../../styles/MenuBar.scss"
const ProfileAttachedToDoc = (props) => {
    const {userList} = useContext(ResultContext);
    return(
        <>
            {
                props.document && userList != undefined && Object.keys(userList).length >1?
                <>
                    {
                        Object.entries(userList).filter(([key, val]) => key !== props.currentUser.uid).map(([key, val]) =>
                            <img alt="user" src={val.photoURL} className="menu-bar-user-profile-picture"/>
                        )
                    }
                </>
                :null
            }
        </>
    )
}
export default ProfileAttachedToDoc;