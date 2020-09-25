import React from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import Projects from './Projects'
import MenuBar from '../../components/MenuBar/MenuBar'

/**
 * @description
 * This File Display's All The Project And Also Responsible for Creating New Project 
 * @component
 * @param {*} props Following Are The Props :
 * @property  CurrentUser :- Contains UID And USer's Info 
 * @function signOut() :- This Function Sign Out from Project
 * @returns  JSX Element Consists of Menu Bar &  Projects
 */
export default function Dashboard(props) {
  const location = useLocation()
  /**Logging Out And Redirecting to '/dashboard' */
  const logout = () => {
    props.signOut()
    return (
      <Redirect to={{
        pathname: "/dashboard",
        state: { from: location }
      }}
      />
    )
  }

  return (
    <div>
      <MenuBar onLogOut={logout} currentUser={props.currentUser} />
      <Projects currentUser={props.currentUser} />
    </div>
  )
}
