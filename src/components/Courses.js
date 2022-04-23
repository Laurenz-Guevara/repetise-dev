import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import firebase from "../firebase"

export default function Dashboard() {
  let [course, setCourse] = useState([])
  let { currentUser, logout } = useAuth()
  let [userData, setData] = useState([]);
  let [loading, setLoading] = useState(false);
  const ref = firebase.firestore().collection("courses");
  let enrolledCourses = []

  function getData() {
    setLoading(true);
    firebase.firestore().collection("userData").doc(currentUser.uid).onSnapshot((doc) => {
      const items = [];
      items.push(doc.data());
      setData(items);
      setLoading(false);
    })
    updateCourse()
  }

  function getCourse() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      })
      setCourse(items);
      setLoading(false);
    })
  }

  function updateCourse() {
    let courseTitles = document.querySelectorAll('.deck-title');
    userData.map((course) => {
      enrolledCourses = (course.enrolledCourses)
    })
    for (const courseTitle of courseTitles) {
      for (const course of enrolledCourses){
        if (courseTitle.innerHTML == course) {
          courseTitle.parentElement.parentElement.childNodes[2].classList.add("enrolled")
        }
      }
    }
  }

  function enrollCourse(course, id) {
    let element = document.getElementById(id); 
    if (element.classList.contains("enrolled")) {
      let newEnrolled = enrolledCourses.filter((item) => item !== id)
      element.classList.remove("enrolled")
      enrolledCourses = newEnrolled
      
    } else {
      element.classList.add("enrolled")
      enrolledCourses.push(course.courseName)
    }
    updateEnrolledStatus(element.id)
  }

  function updateEnrolledStatus() {
    const reference = firebase.firestore().collection("userData").doc(currentUser.uid);
    return reference.update({
      enrolledCourses: enrolledCourses
    })
  }

  useEffect(() => {
    getData()
    getCourse()
}, []);

  updateCourse()

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
        <div className="deck-block-intro widget-container courses-panel">
        <h1>Courses</h1>
        <p>Welcome to the courses page, here you can browse and add any language decks into your account. Feel free to select as many as you like!</p>
        </div>
        {course.map((course) => (
        <div key = {course.courseName} className="deck-content-block widget-container ">
          <div className="deck-img-container">
              <img src={course.imageUrl} alt="Repetise picture of app"></img>
          </div>
          <div className="deck-content">
              <h1 className="deck-title">{course.courseName}</h1>
              <h2 className="deck-desc">A deck with {course.totalWords} words.</h2>
              <h2 className="deck-author">Created by {course.courseAuthor}</h2>
              <h2 className="deck-created-date">Date Created - {course.courseCreated}</h2>
          </div>
          <div onClick={() => enrollCourse(course, course.courseName)} className="enroll" id={course.courseName}>
            <h2 className="enroll-button" >Select Course</h2>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}
