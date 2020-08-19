import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { APP_CONSTANTS } from "../../constants/appConstants"
import { auth } from '../../services/auth'
import Button from '../../components/Button'
import AppContext from '../../contexts/AppContext'

const Dashboard = () => {
  const appContext = useContext(AppContext)
  const history = useHistory()
  const logout = () => {
    auth.signOut(() => {
      history.push(APP_CONSTANTS.URLS.LOGIN_URL)
    })
  }
  return (
    <div>
      {/* get data from context can be used as global state */}
      <h3>{appContext.appname}</h3>
      Dashboard
      <Button handleClick={logout}>
        Logout
      </Button>
    </div>
  )
}

export default Dashboard
