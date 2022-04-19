import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <div className="header-container">
        <div className="header-bar">
          <Link to="/" className="header-element"><h1>Repetise</h1></Link>
          <Link to="/" className="header-element"><h1>Home</h1></Link>
          <Link to="/stats" className="header-element"><h1>Stats</h1></Link>
          <Link to="/courses" className="header-element"><h1>Courses</h1></Link>
        </div>
      </div>
      <div className="wrapper">
        <div className="inner-wrapper">
          <h1>Stats</h1>
        </div>
      </div>
    </div>
  )
}
