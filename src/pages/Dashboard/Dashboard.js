import React, { useEffect } from 'react'
import MenuBar from '../../components/MenuBar/MenuBar'
import Card from "./Card"
import { observer } from 'mobx-react-lite'

import "../../styles/Projects.scss"
import { useStore } from '../../store/hook'
import { useHistory, useLocation } from 'react-router-dom'

const Dashboard = observer(() => {
  let store = useStore();
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    store.addDashboardListeners()
    return () => store.removeDashboardListeners()
  }, [store])

  const signOut = () => {
    store.signout();
    history.push('/login', { from: location });
  }
  return (
    <div className="dashboard-page">
      <MenuBar dashboard currentUser={store.currentUser} signOut={signOut} />
      <div className="project-view-container">
        <div className="project-container-title">Your Projects</div >
        <div className="project-card-container">
          <Card addNew />
          {store.ownProjects.length > 0
            ? store.ownProjects.map((id) => <Card key={id} id={id} />)
            : <div className="project-container-nodata">
              You have not created any projects yet. What are you waiting for? Click "Add a Project" to begin.
            </div>
          }
        </div>
        <div className="project-container-title">Shared With You</div>
        <div className="project-card-container">
          {store.sharedProjects.length > 0
            ? store.sharedProjects.map((id) => <Card key={id} id={id} />)
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
