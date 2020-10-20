import React from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import Projects from './Projects'
import MenuBar from '../../components/MenuBar/MenuBar'
import StoreProvider from './StoreCardContext'

export default function Dashboard(props) {
  const location = useLocation()

  const logout = () => {
    //console.log("logout was triggered")
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
      <StoreProvider>
      <MenuBar onLogOut={logout} currentUser={props.currentUser} dashboard={true}/>
      <Projects currentUser={props.currentUser} />
      </StoreProvider>
    </div>
  )
}
