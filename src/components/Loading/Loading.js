import React from 'react'
function Loading() {
  return (
    <div>
      <img src={require("./loader.svg")} className="loader" alt=""/>
    </div>
  )
}

export default Loading
