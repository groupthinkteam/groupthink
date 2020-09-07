import React from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import Projects from './Projects'
import MenuBar from '../../components/MenuBar/MenuBar'

export default function Dashboard(props) {
  const location = useLocation()

  const logout = () => {
    console.log("logout was triggered")
    props.signOut()
    return (
      <Redirect to={{
        pathname: "/login",
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
