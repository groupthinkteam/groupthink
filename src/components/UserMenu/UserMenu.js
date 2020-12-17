
import React from "react";
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/hook'
import '../../styles/UserMenu.scss'

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
                <a href="/dashboard" className="colorblack">Dashboard</a>
                <br />
                <a href="/dashboard" className="colorblack">Settings</a>
                <br />
                <a href="true" onClick={props.signOut} className="colororange">Logout</a>
              </div>
        </div>
    );
};

export default observer(UserMenu);