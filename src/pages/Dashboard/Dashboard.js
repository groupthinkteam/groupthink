import React, { useEffect } from 'react'
import MenuBar from '../../components/MenuBar/MenuBar'
import Card from "./Card"
import { observer } from 'mobx-react-lite'

import "../../styles/Projects.scss"
import { useStore } from '../../store/hook'
import { useHistory, useLocation } from 'react-router-dom'

const Dashboard = observer(() => {
  const {addDashboardListeners,currentUser,ownProjects,sharedProjects,removeDashboardListeners,signout} = useStore();
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    addDashboardListeners()
    return () => removeDashboardListeners()
  }, [addDashboardListeners , removeDashboardListeners])

  const signOut = () =>{
    signout();
    history.push('/login',{from : location});
    
  }
  return (
    <div className="dashboard-page">
      <MenuBar dashboard currentUser={currentUser} signOut={signOut}/>
      <div className="project-view-container">
        <div className="project-container-title">Your Projects</div >
        <div className="project-card-container">
          <Card addNew />
          {ownProjects.length > 0
            ? ownProjects.map((id) => <Card key={id} id={id} />)
            : <div className="project-container-nodata">
              You have not created any projects yet. What are you waiting for? Click "Add a Project" to begin.
            </div>
          }
        </div>
        <div className="project-container-title">Shared With You</div>
        <div className="project-card-container">
          {sharedProjects.length > 0
            ? sharedProjects.map((id) => <Card key={id} id={id} />)
            : <div className="project-container-nodata">
              No one has shared a project with you yet. SAD!
            </div>
          }
        </div>
      </div>
    </div>
  )
})
export default Dashboard;
