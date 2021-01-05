import React from "react";
import { Link } from "react-router-dom";
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/hook'
import '../../styles/UserMenu.scss'

const UserMenu = (props) => {
  let store = useStore();
    return (
        <div className="user-menu-container">
              <div className="colorblack">
                <h4>{store.currentUser.displayName}</h4>
              </div>
              <div className="info">
                <img className="ea-logo" src={require("../../assets/menu/ealogo.svg")} alt="early access"/>
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