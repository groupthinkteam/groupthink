import React, { useState, useEffect, useRef } from 'react'
import DashboardCard from "./DashboardCard"
import { observer } from 'mobx-react-lite'
import ChooseTemplate from '../../components/ChooseTemplate/ChooseTemplate'
import "../../styles/Dashboard.scss"
import { useStore } from '../../store/hook'
import { useHistory, useLocation } from 'react-router-dom'
import SearchBar from '../../components/Search/SearchBar'
import UserMenu from "../../components/UserMenu/UserMenu"

const Dashboard = observer(() => {
  const store = useStore();
  const history = useHistory();
  const buttonRef = useRef(null);
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [filterProject, setFilterProject] = useState('All Projects');

  useEffect(() => {
    if (store.filteredProjectID.length)
      setFilterProject('Searching Project')
    else setFilterProject('All Projects')
  }, [store.filteredProjectID.length])

  useEffect(() => {
    store.addDashboardListeners()
    return () => store.removeDashboardListeners()
  }, [store])

  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonRef]);

  const onOpen = (id) => {
    store.setProjectID(id);
    history.push("/project/" + id, { from: location })
  }

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
          <div ref={buttonRef} className="profile-picture">
            <img alt={store.currentUser.displayName} src={store.currentUser.photoURL} onClick={() => setShowMenu(!showMenu)} />
            {showMenu ?
              <span className="user-menu">
                <UserMenu store={store} dashboard />
              </span> : null}
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
              <ChooseTemplate
                openProject={onOpen}
              />
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