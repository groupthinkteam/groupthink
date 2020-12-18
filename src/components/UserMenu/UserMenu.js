import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import '../../styles/UserMenu.scss'

const UserMenu = ({ store, document, dashboard }) => {
  const history = useHistory();
  const location = useLocation();
  const signOut = () => {
    store.signout();
    history.push('/login', { from: location });
  }
  return (
    <div>
      <div style={{ color: "black" }}>
        <h4>{store.currentUser.displayName}</h4>
      </div>
      <div className="info">
        <p className="colororange">Early Access</p>
      </div>
      <hr className="separator" />
      <div className="options">
        {
          document ?
            <>
              <Link to="/dashboard" className="colorblack">
                Dashboard
              </Link>
              <br />
            </>
            : null
        }

        <a href="/dashboard" className="colorblack">Settings</a>
        <br />
        <a href="true" onClick={signOut} className="colororange">Logout</a>
      </div>
    </div>
  );
};

export default UserMenu;