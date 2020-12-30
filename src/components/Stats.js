import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <div className="desktop-header">
        <div className="header-bar">
          <Link to="/" className="logo"><h1>Repitise</h1></Link>
          <Link to="/" className="logo"><h1>Repitise</h1></Link>
          <Link to="/" className="logo"><h1>Repitise</h1></Link>
          <Link to="/" className="logo"><h1>Repitise</h1></Link>
        </div>
      </div>
      {/* <h2>Profile</h2>
      {error && <h1>An error logging out</h1>}
      <h3>Email: </h3> { currentUser.email}
      <Link to="/update-profile">Update Profile</Link>
      <div>
        <button onClick={handleLogout} type="submit">Logout</button>
      </div> */}
    </div>
  )
}
