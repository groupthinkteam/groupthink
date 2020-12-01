import React from "react";
import '../../styles/PopupMenu.scss'

const Popup = ({ children, handleClose, ...rest }) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={handleClose}>x</span>
        {children}
      </div>
    </div>
  );
};

export default Popup;