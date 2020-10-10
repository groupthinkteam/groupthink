import React from 'react'
function Loading() {
  return (
    <div className="loader-container">
      <img className="loader-animation"
        src={require("../../assets/loadingscience.gif")}
        height="60%"
        alt="Loading" />
      <div className="loader-text">
        Preparing Your Document...
      </div>
    </div>
  )
}

export default Loading
