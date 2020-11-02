import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";

const UserMenu = (props) => {

    const [showPopper, setShowPopper] = useState(false);
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState(null);

    const { styles, attributes } = usePopper(
        buttonRef.current,
        popperRef.current,
        {
            modifiers: [
                {
                    name: "arrow",
                    options: {
                        element: arrowRef
                    }
                },
                {
                    name: "offset",
                    options: {
                        offset: [0, 10]
                    }
                }
            ]
        }
    );

    return (
        <>
        
        <Page>
            <img alt="" onClick={() => setShowPopper(!showPopper)} className={props.imageClass} src={props.photoURL} ref={buttonRef} />

            {showPopper
                ? <PopperContainer
                    ref={popperRef}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <div ref={setArrowRef} style={styles.arrow} id="arrow" />
                    <img src={props.photoURL} className="profimage" style={ProfImage}></img>
                    <h4>{props.username}</h4>
                    <p style={{ color: "orange" }}>groupthink <b>pro</b></p>
                    <hr />

                    <a href="#" target="blank" style={{ color: "black" }}>Profile</a>
                    <br />
                    <a href="/dashboard" style={{ color: "black" }}>Dashboard</a>
                    <br />
                    <a href="#" target="blank" style={{ color: "black" }}>Settings</a>
                    <hr />
                    <a href="#" target="blank" style={{ color: "black" }}>Help About</a>
                    <hr />
                    <a href="" onClick={props.signOut} style={{ color: "orange" }}>Logout</a>


                </PopperContainer> : null}
        </Page>
    </>);
};

const Page = styled.div`
   width: 20%
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const PopperContainer = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
  padding: 10px;
  text-align: center;

  #arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    &:after {
      content: " ";
      background-color: white;
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
      position: absolute;
      top: -15px; // padding + popper height
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
    }
  }

  &[data-popper-placement^='top'] > #arrow {
    bottom: -20px;
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
`;
const ProfImage = {
    borderRadius: '50%',
    height: '100px',
    width: '100px'
}
export default UserMenu;