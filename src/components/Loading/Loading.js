import React, { useEffect } from 'react'
import { gsap } from 'gsap/all'

import "./loader.scss"

function Loading() {
  const loadertext = ["Pulling up your document", "Aligning some planets", "Calibrating the vibe", "Preparing some pixels"]
  useEffect(() => {
    // let tl0 = gsap.timeline({ paused: true, repeat: 100, yoyo: true })
    // tl0.to(".loader-kite", { top: "40px", duration: 2.5, ease: "sine.inOut"})
    //   .to(".loader-kite", { top: "80px", duration: 2.5, })
    // tl0.play(true)
    let tl1 = gsap.timeline({ paused: true, repeat: 100 })
    tl1.to(".loader-kite", { left: "100px", duration: 5, ease: "slow" })
      .to(".loader-kite", { left: "-200px", duration: 5, ease: "slow" })
    tl1.play(true)
    let tl2 = gsap.timeline({ paused: true, repeat: 500 })
    tl2.to(".colorbar", { width: "100%", duration: 5, ease: "slow" })
      .to(".colorbar", { width: "0%", duration: 5, ease: "slow" })
    tl2.play(true)
  }, [])
  return (
    <div className="loader-container">
      <img src={require("../../assets/login/graphic-right.svg")} className="graphic-right" alt="decoration" />
      <img src={require("../../assets/login/graphic-left.svg")} className="graphic-left" alt="decoration" />
      <img className="loader-kite"
        src={require("../../assets/loaders/kite.svg")}
        height="100px"
        alt="Loading" />
      <div className="progressbar">
        <div className="colorbar" />
      </div>
      <div className="loader-text">
        {loadertext[Math.floor(Math.random() * loadertext.length)]}...
      </div>
    </div>
  )
}

export default Loading
