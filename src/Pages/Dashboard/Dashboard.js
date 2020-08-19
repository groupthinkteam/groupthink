import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { APP_CONSTANTS } from "../../constants/appConstants"
import { useAuth } from '../../services/auth'
import Button from '../../components/Button'
import AppContext from '../../contexts/AppContext'

const Dashboard = () => {
  const appContext = useContext(AppContext)
  const history = useHistory()
  const { auth, authState } = useAuth();
  const logout = () => {
    auth().signOut().then(() => history.push(APP_CONSTANTS.URLS.LOGIN_URL))
  }
  return (
    <div>
      {/* get data from context can be used as global state */}
      Welcome to <h3>{appContext.appname}</h3>
      Dashboard, {authState.user ? authState.user.displayName : "waiting"}. <br />
      <Button handleClick={logout}>
        Logout
      </Button>
    </div>
  )
}

export default Dashboard
