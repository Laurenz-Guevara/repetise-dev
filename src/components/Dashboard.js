import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const { history } = useHistory()

  async function handleLogout(){
    setError('')

    try {
      await logout()
      history.push('./login')
    } catch {
      setError('Fail to log out')
    }
  }

  return (
    <div>
      Dashboard
      <h2>Profile</h2>
      {error && <h1>An error logging out</h1>}
      <h3>Email: </h3> { currentUser.email}
      <Link to="/update-profile">Update Profile</Link>
      <div>
        <button onClick={handleLogout} type="submit">Logout</button>
      </div>
    </div>
  )
}
