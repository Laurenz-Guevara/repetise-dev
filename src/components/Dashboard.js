import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import firebase from "../firebase"
import { useLayoutEffect, useRef } from 'react/cjs/react.production.min'

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const { history } = useHistory()
  //const [userData, setData] = useState([]);
  let userData = [];
  const [userInfoData, setUserInfoData] = useState([]);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  let enrolledCourse = [""]
  let ref = []

  function getData() {
    setLoading(true);
    firebase.firestore().collection("userData").doc(currentUser.uid).onSnapshot((doc) => {
      const items = [];
      items.push(doc.data());
      userData = items
      setUserInfoData(items)
      getCourse(items)
      setLoading(false);
  
    })
  }

  function getCourse() {
    setLoading(true);
    userData.map((course) => {
      enrolledCourse = (course.enrolledCourses)
    })
    try {
      ref = firebase.firestore().collection("courses").where("courseName", "in", enrolledCourse)
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        })
        setCourse(items);
        setLoading(false);
      })
    } catch {} //Change P tag to say "Please enroll in a course"
  }

  function startCourse(course) {
    localStorage.setItem('course', JSON.stringify(course))
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
          <Link to="/" className="header-element"><h1>Repetise</h1></Link>
          <Link to="/" className="header-element"><h1>Home</h1></Link>
          <Link to="/stats" className="header-element"><h1>Stats</h1></Link>
          <Link to="/courses" className="header-element"><h1>Courses</h1></Link>
        </div>
      </div>
      <div className="wrapper">
        <div className="inner-wrapper">
          <div className="deck-block widget-container">
            {userInfoData.map((user) => (
              <div key = {user.userName}>
                <h1>{user.userName}</h1>
                <h1>{user.userEmail}</h1>
              </div>
            ))}
          </div>
          
          {course.map((course) => (
          <div key = {course.courseName} className="deck-block widget-container ">
            <div className="deck-img-container">
                <img src={course.imageUrl} alt="Repetise picture of app"></img>
            </div>
            <div className="deck-content">
                <h1 className="deck-title">{course.courseName}</h1>
                <h2 className="deck-desc">A deck with {course.totalWords} words.</h2>
                <h2 className="deck-author">Created by {course.courseAuthor}</h2>
                <h2 className="deck-created-date">Date Created - {course.courseCreated}</h2>
            </div>
            <div onClick={() => startCourse(course.courseName)} id={course.courseName}>
            <Link to="/flashcards" className="header-element"><h2 className="enroll-button" >Start Course</h2></Link>
            </div>
          </div>
          ))}

          <div className="profile-component widget-container">
            <h2>Profile Options</h2>
            {error && <h1>An error logging out</h1>}
            <Link to="/update-profile">Update Profile</Link>
            <div>
              <button onClick={handleLogout} type="submit">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
