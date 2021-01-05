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
        <img className="ea-logo" src={require("../../assets/menu/ealogo.svg")} alt="early access" />
      </div>
      <hr className="separator" />
      <div className="options">
        <Link to="/dashboard" className="option">Dashboard</Link>
        <Link to="/settings" className="option">Settings</Link>
        <hr className="separator" />
        <Link to="/dashboard" className="option">What's New</Link>
        <a href="https://www.notion.so/Kite-Frequently-Asked-Questions-fd7252bf67e944a1976b150590c37ed0" target="_blank" rel="noreferrer" className="option">
          Help and FAQ
        </a>
        <hr className="separator" />
        <span onClick={props.signOut} className="option danger">Logout</span>
      </div>
    </div>
  );
};

export default observer(UserMenu);