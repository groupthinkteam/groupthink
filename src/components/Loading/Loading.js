import React, { useEffect } from 'react'
import { gsap } from 'gsap/all'

function Loading() {
  const loadertext = ["Pulling up your document", "Aligning some planets", "Calibrating the vibe", "Preparing some pixels"]
  // useEffect(() => {
  //   let bounceup = gsap.to(".loader-animation", { y: "+=20", duration: 0.5 })
  //   let bouncedown = gsap.to(".loader-animation", { y: "-=20", duration: 0.5 })
  // }, [])
  return (
    <div className="loader-container">
      <img src={require("../../assets/login/graphic-right.svg")} className="graphic-right" alt="decoration" />
      <img src={require("../../assets/login/graphic-left.svg")} className="graphic-left" alt="decoration" />
      <img className="loader-animation"
        src={require("../../assets/loaders/kiteprogress.svg")}
        height="60%"
        alt="Loading" />
      <div className="loader-text">
        {loadertext[Math.floor(Math.random() * loadertext.length)]}...
      </div>
    </div>
  )
}

export default Loading
