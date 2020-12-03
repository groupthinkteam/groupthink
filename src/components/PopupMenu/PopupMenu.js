import React from "react";
import '../../styles/PopupMenu.scss'

const Popup = ({ children, handleClose, ...rest }) => {
  return (
    <div className="popup-box">
      <div className="box">
        <img className="close-icon"
          src={require("../../assets/popup/close.svg")}
          alt="close"
          onClick={handleClose}
        />
        {children}
      </div>
    </div>
  );
};

export default Popup;