import React, { useContext } from 'react'
import { auth } from '../../services/auth'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import AppContext from '../../contexts/AppContext'

const Dashboard = () => {
  const appContext = useContext(AppContext)
  const history = useHistory()
  const logout = () => {
    auth.signout(() => {
      history.push('/login')
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
