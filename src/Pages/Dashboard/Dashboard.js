import React from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import Button from '../../components/Button'

export default function Dashboard(props) {
  const location = useLocation()
  const logout = () => {
    props.signOut()
    return (
      <Redirect to={{
        pathname: "/login",
        state: { from: location }
      }}
      />
    )
  }
  return (
    <div>
      <Button handleClick={logout}>
        Logout
      </Button>
    </div>
  )
}
