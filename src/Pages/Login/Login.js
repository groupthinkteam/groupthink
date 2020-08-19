import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { useAuth } from '../../services/auth'

export default function LoginPage() {
  const { auth, uiConfig, authState } = useAuth()
  if (authState.pending) {
    return <h1>waiting...</h1>
  }

  return (
    <div>
      <h1>Welcome to groupthink</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
    </div>
  )
}