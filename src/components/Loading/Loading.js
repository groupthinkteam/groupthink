import React from 'react'
function Loading() {
  const loadertext = ["Pulling up your document", "Aligning some planets", "Calibrating the vibe", "Preparing some pixels"]
  return (
    <div className="loader-container">
      <img className="loader-animation"
        src={require("../../assets/loadingscience.gif")}
        height="60%"
        alt="Loading" />
      <div className="loader-text">
        {loadertext[Math.floor(Math.random() * loadertext.length)]}...
      </div>
    </div>
  )
}

export default Loading
