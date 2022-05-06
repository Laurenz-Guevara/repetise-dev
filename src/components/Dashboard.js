import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import firebase from "../firebase"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const { history } = useHistory()
  let userData = [];
  const [userInfoData, setUserInfoData] = useState([]);
  const [course, setCourse] = useState([]);
  const [cards, setCards] = useState([]);
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
      items.map((user) => {
        if (user.userAdmin == false) {
          document.querySelector('.admin-panel').classList.add('hide')
        }
      })
    })
  }

  function getCourse() {
    try {
      setLoading(true);
      userData.map((course) => {
        enrolledCourse = (course.enrolledCourses)
      })

      ref = firebase.firestore().collection("courses").where("courseName", "in", enrolledCourse)
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        })
        setCourse(items);
        setLoading(false);
      })

      ref = firebase.firestore().collection("courses").where("courseName", "in", enrolledCourse)
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        })
        setCourse(items);
        setLoading(false);
      })

    } catch {}
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
          <Link to="/home" className="header-element"><h1>Repetise</h1></Link>
          <Link to="/courses" className="header-element"><h1>Courses</h1></Link>
          <Link to="/create" className="admin-panel"><h1>Admin</h1></Link>
        </div>
      </div>
      <div className="wrapper">
        <div className="deck-block-intro widget-container">
          {userInfoData.map((user) => (
            <div key = {user.userName} className = "intro-panel">
              <h1 className="user-name">Welcome {user.userName}</h1>
              <div className="misc-container">
                <button className="update-profile-button"><Link to="/update-profile">Update Profile</Link></button>
                <button onClick={handleLogout} type="submit">Logout</button>
              </div>
              <p>If you would like to enroll into a new course or remove a current one please head to the courses page! If you have removed a course your data will not be saved and will require you to learn it again.</p>
            </div>
          ))}
        </div>
          {course.map((course) => (
          <div key = {course.courseName} className="deck-content-block widget-container ">
            <div className="deck-img-container">
                <img src={course.imageUrl} alt="Repetise picture of app"></img>
            </div>
            <div className="deck-content">
                <h1 className="deck-title">{course.courseName}</h1>
                <h2 className="deck-author">Created by {course.courseAuthor}</h2>
                <h2 className="deck-created-date">Date Created - {course.courseCreated}</h2>
            </div>
            <div onClick={() => startCourse(course.courseName)} className="deck-interactive" id={course.courseName}>
            <Link to="/flashcards" className="header-element"><h2 className="start-course" >Start Course</h2></Link>
            </div>
          </div>
          ))}
      </div>
    </div>
  )
}
