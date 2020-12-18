
import React from "react";
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/hook'
import '../../styles/UserMenu.scss'
import { Link } from "react-router-dom";

const UserMenu = (props) => {
    let store = useStore();
   
    return (
        <div>
              <div style={{color: "black"}}>
                <h4>{store.currentUser.displayName}</h4>
              </div>
              <div className="info">
                <p className="colororange">Early Access</p>
              </div>
              <hr className="separator" />
              <div className="options">
              <Link to="/dashboard" className="colorblack">Dashboard</Link>
                <br />
                <Link to="/settings" className="colorblack">Settings</Link>
                <br />
                <a href="true" onClick={props.signOut} className="colororange">Logout</a>
              </div>
        </div>
    );
};

export default observer(UserMenu);