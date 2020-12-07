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
  const [filterProject, setFilterProject] = useState('All Projects');
  // console.log(store.filteredProjectID)
  useEffect(() => {
    if (store.filteredProjectID.length)
      setFilterProject('Searching Project')
    else setFilterProject('All Projects')
  }, [store.filteredProjectID.length])

  useEffect(() => {
    store.addDashboardListeners()
    return () => store.removeDashboardListeners()
  }, [store])

  const onOpen = (id) => {
    store.setProjectID(id);
    history.push("/project/" + id, { from: location })
  }

  // const signOut = () => {
  //   store.signout();
  //   history.push('/login', { from: location });
  // }

  const sortProject = () => {
    switch (filterProject) {
      case 'All Projects':
        return store.allProjects;
      case 'Starred Project':
        return store.starredProjects;
      case 'Shared Project':
        return store.sharedProject;
      case 'Searching Project':
        return store.searchedProject;
      default: break;
    }
  }

  return (
    <div className="dashboard-page">
      <div className="top-bar">
        <div className="site-title">
          <img src={require("../../assets/dashboard/logo.svg")} alt="logo" />
        </div>
        <div className="user-welcome">
          <div className="welcome-text">
            <span className="welcome-bold">Welcome,</span>
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
                <select className="select" name="permission" id="permission" onChange={e => setFilterProject(e.target.value)}>
                  <option value={'All Projects'}>
                    All Projects
                  </option>
                  <option value="Starred Project">
                    Starred
                  </option>
                  {/* <option value="Shared Project">
                    Shared Project
                  </option> */}
                </select>
              </div>
              <button className="addnew" onClick={() => store.addNewProject((id) => onOpen(id))}>
                + Create
              </button>
            </div>
            <SearchBar dashboard />
          </div>

          <div className="project-section-content">
            <div className="row-headings">
              <span className="heading title">Title</span>
              <div className="rest">
                <span className="heading date">Last edited</span>
                <span className="heading date">Created</span>
                <span className="heading shared">Shared with</span>
              </div>
            </div>
            {
              sortProject().map((id) => <DashboardCard key={id} id={id} onOpen={() => onOpen(id)} />)
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