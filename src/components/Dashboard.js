import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import firebase from "../firebase"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const { history } = useHistory()

  const [users, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = firebase.firestore().collection("users")
 
  function getData() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setData(items);
      setLoading(false);
    })
  }

  useEffect(() => {
    getData();
  }, [])

  async function handleLogout(){
    setError('')

    try {
      await logout()
      history.push('./login')
    } catch {
      setError('Fail to log out')
    }
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className="header-container">
        <div className="header-bar">
          <Link to="/" className="header-element"><h1>Repitise</h1></Link>
          <Link to="/" className="header-element"><h1>Home</h1></Link>
          <Link to="/stats" className="header-element"><h1>Stats</h1></Link>
          <Link to="/courses" className="header-element"><h1>Courses</h1></Link>
        </div>
      </div>
      <div className="wrapper">
        <div className="inner-wrapper">

          <div className="deck-block widget-container">
            <div className="deck-img-container">
              <img src={"https://bit.ly/34V0aks"} alt="Repitise picture of app"></img>
            </div>
            <div className="deck-content">
              <h1 className="deck-title">HSK1 Chinese</h1>
              <h2 className="deck-desc">A deck with 150 words found in HSK1</h2>
              <h2 className="deck-progress">120/150 words learned</h2>
              <div className="level-bar"></div>
              <div className="deck-misc-info">
                <h2 className="deck-author">Created by Laurenz Guevara</h2>
                <h2 className="deck-created-date">Date Created - 04/11/2020</h2>
              </div>
            </div>   
          </div>

          <div className="deck-block widget-container">
            <div className="deck-img-container">
              <img src={"https://bit.ly/3o1qscj"} alt="Repitise picture of app"></img>
            </div>
            <div className="deck-content">
              <h1 className="deck-title">Top 100 Korean Words</h1>
              <h2 className="deck-desc">The top 100 used Korean words</h2>
              <h2 className="deck-progress">43/100 words learned</h2>
              <div className="level-bar"></div>
              <div className="deck-misc-info">
                <h2 className="deck-author">Created by Laurenz Guevara</h2>
                <h2 className="deck-created-date">Date Created - 08/10/2020</h2>
              </div>
              
            </div>   
          </div>

          <div className="deck-block widget-container">
            <h1>Users</h1>
            {users.map((user) => (
              <div key={user.id}>
                <h2>User - Title</h2>
                <p>{user.firstname}</p>
                <p>{user.secondname}</p>
              </div>
            ))}
          </div>

          <div className="profile-component widget-container">
            <h2>Profile</h2>
            {error && <h1>An error logging out</h1>}
            <h3>Email: </h3> { currentUser.email}
            <Link to="/update-profile"> Update Profile</Link>
            <div>
              <button onClick={handleLogout} type="submit">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
