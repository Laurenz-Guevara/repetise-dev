import React, {useRef, useState, useEffect} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory, history } from 'react-router-dom'
import firebase from "../firebase"
import { Route } from 'react-router-dom'
import '../styles/widget.scss';


export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [loading, setLoading] = useState(false);
  const history = useHistory()
  let courseName = useRef()
  let pronunciation = useRef()
  let word = useRef()
  let translation = useRef()
  let authorName = useRef()
  let imageUrl = useRef()
  let courseNameCard = useRef()

  function getData() {
    setLoading(true);
    firebase.firestore().collection("userData").doc(currentUser.uid).onSnapshot((doc) => {
      const items = [];
      items.push(doc.data());
      
      items.map((user) => {
        if (user.userAdmin === false) {
          console.log(user.userAdmin)
          history.push('/')
          setLoading(false)
        }
        else {
          setLoading(false)
        }
      })
    })
  }

  function createDeck(e) {
    let date = new Date();
    date = ("Date", date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()) 
    e.preventDefault();
    let reference = firebase.firestore().collection("courses");
    return reference.doc(courseName.current.value).set({
      courseAuthor: authorName.current.value,
      courseCreated: date,
      courseName: courseName.current.value,
      imageUrl: imageUrl.current.value
    },
    {merge: true})
  }

  function submitWords(e) {
    let date = new Date();
    date = ("Date", date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()) 

    e.preventDefault();

    let reference = firebase.firestore().collection("courses").doc(courseNameCard.current.value).collection("words")
    return reference.add({
      course: courseNameCard.current.value,
      pronunciation: pronunciation.current.value,
      ["review-date"]: date,
      ["review-status"]: "new",
      translatedMeaning: translation.current.value,
      translatedWord: word.current.value,
      weight: 0
    });
  }

  useEffect(() => {
    getData();
  }, [])

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className="header-container">
        <div className="header-bar">
          <Link to="/home" className="header-element"><h1>Repetise</h1></Link>
          <Link to="/home" className="header-element"><h1>Home</h1></Link>
        </div>
      </div>
      <div className="wrapper">
      <div className="deck-block-intro widget-container">
        <div className = "intro-panel">
          <h1 className="user-name">Admin Panel</h1>
          <p>Create a deck here. In case of any mistakes while creating a course and adding cards please access Cloud Firestore and edit any database entries.</p>
        </div>
      </div>
      <div className="deck-content-block widget-container ">
        <div className="deck-content">
          <form onSubmit={submitWords}>
            <h2 className="create-title">Add Cards</h2>
            <div className="create-wrapper">
              <div className="create-container">
                <div className="create-container">
                  <label htmlFor="course-name"><b>Course Name: </b></label>
                  <input className="input-form" type="text" ref={courseNameCard} placeholder="Convey what the course is about..." required></input>
                </div>
                <div className="create-container">
                  <label htmlFor="course-name"><b>Pronunciation: </b></label>
                  <input className="input-form" type="text" ref={pronunciation} placeholder="Leave blank if same as the word..."></input>
                </div>
                <div className="create-container">
                  <label htmlFor="course-name"><b>Target Word: </b></label>
                  <input className="input-form" type="text" ref={word} placeholder="Target word..." required></input>
                </div>
                <div className="create-container">
                  <label htmlFor="course-name"><b>Translation: </b></label>
                  <input className="input-form" type="text" ref={translation} placeholder="Enter english translation..." required></input>
                </div>
              </div>
              <div className="form-secondary">
                <button className="create-button" type="submit">Update</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="deck-content-block widget-container ">
        <div className="deck-content">
          <form onSubmit={createDeck}>
            <h2 className="create-title">Update Existing Deck Details</h2>
            <div className="create-wrapper">
              <div className="create-container">
                <label htmlFor="course-name"><b>Course Name: </b></label>
                <input className="input-form" type="text" ref={courseName} placeholder="Convey what the course is about..." required></input>
              </div>
              <div className="create-container">
                <label htmlFor="course-name"><b>Author Name: </b></label>
                <input className="input-form" type="text" ref={authorName} placeholder="Author name of the course..." required></input>
              </div>
              <div className="create-container">
                <label htmlFor="course-name"><b>Course Image URL: </b></label>
                <input className="input-form" type="text" ref={imageUrl} placeholder="Author name of the course..." required></input>
              </div>
            </div>
            <div className="form-secondary">
              <button className="create-button" type="submit">Update</button>
            </div>
          </form>
          </div>
        </div>
      </div>
  </div>
  )
}
