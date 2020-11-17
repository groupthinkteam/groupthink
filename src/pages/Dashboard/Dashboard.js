import React, { useState, useEffect } from 'react'
import DashboardCard from "./DashboardCard"
import { observer } from 'mobx-react-lite'

import "../../styles/Dashboard.scss"
import { useStore } from '../../store/hook'
import { useHistory, useLocation } from 'react-router-dom'
import SearchBar from '../../components/Search/SearchBar'

const Dashboard = observer(() => {
  let store = useStore();
  const history = useHistory();
  const location = useLocation();

  let [currentView, setCurrentView] = useState("all")

  useEffect(() => {
    store.addDashboardListeners()
    return () => store.removeDashboardListeners()
  }, [])

  const onOpen = (id) => {
    store.setProjectID(id);
    history.push("/project/" + id, { from: location })
  }

  const signOut = () => {
    store.signout();
    history.push('/login', { from: location });
  }

  return (
    <div className="dashboard-page">
      <div className="top-bar">
        <div className="site-title">groupthink</div>
        <div className="user-welcome">
          <div className="welcome-text">
            <span className="welcome-bold">Welcome,</span> <br />
            <span className="user-name">{store.currentUser.displayName}</span>
          </div>
          <div className="profile-picture">
            <img alt={store.currentUser.displayName} src={store.currentUser.photoURL} />
          </div>
        </div>
      </div>
      <div className="main-section">
        <div className="project-section">
          <div className="project-section-header">
            <div className="header-left-container">
              <div className="dashboard-title">
                Your Projects
            </div>
              <button className="addnew" onClick={() => store.addNewProject((id) => onOpen(id))}>
                + Create
            </button>
            </div>
            <SearchBar dashboard />
          </div>

          <div className="project-section-content">
            {store.ownProjects.length > 0
              ? store.ownProjects.map((id) => <DashboardCard key={id} id={id} onOpen={() => onOpen(id)} />)
              : null
            }
            {store.sharedProjects.length > 0
              ? store.sharedProjects.map((id) => <DashboardCard shared key={id} id={id} onOpen={() => onOpen(id)} />)
              : null
            }
          </div>
        </div>
        <div className="recent-activity-section">
        </div>
      </div>
    </div >
  )
})
export default Dashboard;