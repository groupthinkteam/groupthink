import React, { useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import Projects from './Projects'
import MenuBar from '../../components/MenuBar/MenuBar'

//EXPORT  Context 
export const DataContext = React.createContext({});

export default function Dashboard(props) {
  const location = useLocation()
  const [cardsDashboard , setCardsDashBoard] = useState({});
  const [resultCards , setResultCards]=useState({});
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
      <DataContext.Provider
        value={{cardsDashboard , setCardsDashBoard, resultCards , setResultCards}}
      >
      <MenuBar onLogOut={logout} currentUser={props.currentUser} dashboard={true}/>
      <Projects currentUser={props.currentUser} />
      </DataContext.Provider>
    </div>
  )
}
