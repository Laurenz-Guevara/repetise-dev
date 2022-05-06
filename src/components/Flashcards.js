import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

import firebase from "../firebase"
import '../styles/flashcard-page.scss';

let pronunciation = []
let reviewDate = []
let reviewStatus = []
let translatedMeaning = []
let translatedWord = []
let courseName = JSON.parse(localStorage.getItem('course'))
let questionCount = 0
let weight = 0
let maxNewCards = 0

export default function Dashboard() {
  
  let [loading, setLoading] = useState(false);
  const [selected, selectedCourse] = useState([]);
  let { currentUser, logout } = useAuth()

  let [ncards, setNewCards] = useState([])
  let [rcards, setReviewCards] = useState([])

  let quizButtons = ''
  let secondaryButtons = ''

  let questionCounter = document.querySelector('.question-count')
  let quizTitle = document.querySelectorAll('.quiz-title h1')
  let targetWord = document.querySelector('.target-word')

  let shuffled = []

  function getCourseCard() {
    maxNewCards = 0
    let itemContentViewer = []
    courseName = JSON.parse(localStorage.getItem('course'))

    let reviewCard = firebase.firestore().collection("userData").doc(currentUser.uid).collection("Progression").where("course", "==", courseName) // Pull in review cards
    reviewCard.onSnapshot((querySnapshot) => {
      itemContentViewer = []
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
          items.map((itemContent) => {
            itemContentViewer = (itemContent['review-status'])
          })
          if (itemContentViewer == "learning") {
            setReviewCards(items)
          }
      })
    })

    let newCard = firebase.firestore().collection("courses").doc(courseName).collection("words").where("review-status", "==", "new") // Pull in new cards
    
    newCard.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
          setNewCards(items)
      })
    })
  }

  const shuffleArray = array => {
    "use strict";
    for (let i = array.length - 1; i > 0; i--) {
        const x = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[x];
        array[x] = temp;
    }
    return array;
  };

  function generateCard(){
    questionCount = 0
    shuffled = []
    let ids = []
    let review = []

    let currentDate = new Date();
    currentDate = ("Date", currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear()) 

    for (const x of rcards) {
      ids.push(x.translatedMeaning)
      review.push(x['review-date'])
    }
    
    let ncardsUpdated = ncards.filter(function(result) {
      return !ids?.includes(result.translatedMeaning)
    });

    let rCardsDateCheck = rcards.filter(function(result) {
      if (result['review-date'] <= currentDate) {
        return review?.includes(result['review-date'])
      }
    })

    ncardsUpdated = ncardsUpdated.slice(0, 10)
    
    shuffled = (ncardsUpdated.concat(rCardsDateCheck))
    shuffled = shuffleArray(shuffled)

    shuffled.map((card) => {
      reviewDate.push(card['review-date'])
      reviewStatus.push(card['review-status'])
      pronunciation.push(card['pronunciation'])
      translatedMeaning.push(card['translatedMeaning'])
      translatedWord.push(card['translatedWord'])
      weight.push(card['weight'])
    })
    loadQuestion();
  }
  
  async function setCard(buttonWeight) {
    try {
      let date = new Date();
      let getDoc = await firebase.firestore().collection("userData").doc(currentUser.uid).collection("Progression").where("translatedWord", "==", translatedWord[questionCount]).get();

      if (getDoc.empty) {
        let oldCounter = questionCount
        date = ("Date", date.getDate() + buttonWeight + '/' + date.getMonth() + '/' + date.getFullYear()) 
        let reference = firebase.firestore().collection("userData").doc(currentUser.uid).collection("Progression")
        return reference.add({
          course: courseName,
          pronunciation: pronunciation[oldCounter],
          ["review-date"]: date,
          ["review-status"]: "learning",
          translatedMeaning: translatedMeaning[oldCounter],
          translatedWord: translatedWord[oldCounter],
          weight: (buttonWeight + weight[questionCount])
        });
      } 

      if (buttonWeight == 0) { //if Again
        date = ("Date", date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()) 
        let reference = firebase.firestore().collection("userData").doc(currentUser.uid).collection("Progression").doc(getDoc.docs[0].id)
        return reference.update({
          ["review-date"]: date,
          ["review-status"]: "learning",
          weight: 0
        });
      }

      else {
        date = ("Date", date.getDate() + buttonWeight + '/' + date.getMonth() + '/' + date.getFullYear()) 
        let reference = firebase.firestore().collection("userData").doc(currentUser.uid).collection("Progression").doc(getDoc.docs[0].id)
        return reference.update({
          ["review-date"]: date,
          ["review-status"]: "learning",
          weight: buttonWeight + weight[questionCount]
        });
      }
    } catch {alert("Error Occured, please refresh page and try again.")} 
    loadQuestion()  
  }

  function loadQuestion() {
    document.querySelector(".quiz-panel").classList.add("display-quiz")
    document.querySelector(".quiz-answer").classList.add("hide")
    document.querySelector(".quiz-answer").classList.remove("display-quiz")
    
    if (questionCount < translatedWord.length) {
      questionCounter = document.querySelector('.question-count')
      questionCounter.innerText = `Card: ${questionCount + 1} out of ${translatedWord.length}`;
      targetWord.innerText = translatedWord[questionCount]
    } else {
      document.querySelector(".quiz-panel").classList.add("hide")
      document.querySelector(".quiz-answer").classList.add("hide")
      document.querySelector(".quiz-panel-behind").classList.remove("hide")
    }
  }

  async function buttonSelected(button) {
    switch(button) {
      case 'btn-1':
        await setCard(3)
        questionCount++
        loadQuestion()
        break;
      case 'btn-2':
        await setCard(1)
        questionCount++
        loadQuestion()
        break;
      case 'btn-3':
        await setCard(0)
        questionCount++
        loadQuestion()
        break;
      case 'btn-4':
        questionCount++
        loadQuestion()
        break;
      case 'answer':

        document.querySelector(".quiz-panel").classList.remove("display-quiz")
        document.querySelector(".quiz-answer").classList.remove("hide")
        document.querySelector(".quiz-answer").classList.add("display-quiz")

        let targetWordBack = document.querySelector('.target-back')
        let pinyin = document.querySelector('.pinyin')
        let translation = document.querySelector('.translation')

        quizTitle = document.querySelector('.quiz-title-back h1')
        quizTitle.textContent = courseName

        questionCounter = document.querySelector('.question-count-behind')
        questionCounter.innerText = `Card: ${questionCount + 1} out of ${translatedWord.length}`;
      
        pinyin.innerText = pronunciation[questionCount]
        targetWordBack.innerText = translatedWord[questionCount]
        translation.innerText = translatedMeaning[questionCount]
        break;
      default:
        alert("None selected")
        break;
    }
  }

  function startButton() {
    pronunciation = []
    reviewDate = []
    reviewStatus = []
    translatedMeaning = []
    translatedWord = []
    weight = []
    quizButtons = document.querySelectorAll('.quiz-button')
    secondaryButtons = document.querySelectorAll('.secondary-button')
    
    quizTitle = document.querySelector('.quiz-title h1')
    targetWord = document.querySelector('.target-word')

    document.querySelector(".quiz-panel").classList.add("display-quiz")
    document.querySelector(".quiz-start-screen").classList.add("hide")
    document.querySelector(".quiz-panel-behind").classList.add("hide")

    if (localStorage && localStorage.getItem('course')) {
      selectedCourse(courseName)
      quizTitle.textContent = courseName
      generateCard()
    }
    else {
      selectedCourse('None Selected')
    }
  }

  useEffect(() => {
    getCourseCard()
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className="header-container">
        <div className="header-bar">
          <Link to="/home" className="header-element"><h1>Repetise</h1></Link>
          <Link to="/home" className="header-element"><h1>Home</h1></Link>
          <Link to="/courses" className="header-element"><h1>Courses</h1></Link>
        </div>
      </div>
      <main className="main-section">
            <div className="flashcard-quiz-wrapper">
                <div className="quiz-start-screen">
                    <div className="content-box text-content">
                        <h1>Repetise Flashcards</h1>
                        <p>Please look at the card and select the option that best suits your perception of the word. If you did not recall the card correctly please select "Again". 10 New cards will be added and any reviews that are due for today will appear too.</p>
                    </div>
                    <button onClick={() => startButton()} className="white-button" id="start" title="Start button">Start</button>
                </div>
                <div className="quiz-panel">
                  <div className="quiz-title">
                        <h1>Quiz title</h1>
                    </div>
                    <div className="progression">
                        <p className="counters question-count">Question: 0</p>
                    </div>
                    <div className="quiz-word">
                        <h1 className='target-word'>Loading...</h1>
                    </div>
                    <div className="answers-wrapper">
                        <button onClick={() => buttonSelected('answer')} className="quiz-button" title="Show Answer">Reveal</button>
                    </div>
                    <div className="secondary-buttons-wrapper">
                      <Link to="/home"><button className="quiz-button secondary-button quit-button">Quit</button></Link>
                    </div>
                </div>

                <div className="quiz-panel quiz-answer hide">
                  <div className="quiz-title quiz-title-back">
                        <h1>Quiz title</h1>
                    </div>
                    <div className="progression">
                        <p className="counters question-count question-count-behind">Question: 0</p>
                    </div>
                    <div className="quiz-word">
                        <p className='pinyin'>Loading...</p>
                        <h1 className='target-word target-back'>Loading...</h1>
                        <div className="spacer"></div>
                        <p className='translation'>Loading...</p>
                        
                    </div>
                    <div className="answers-wrapper">
                        <button onClick={() => buttonSelected('btn-1')}className="quiz-button" title="Answer one">Easy</button>
                        <button onClick={() => buttonSelected('btn-2')}className="quiz-button" title="Answer two">Hard</button>
                        <button onClick={() => buttonSelected('btn-3')}className="quiz-button" title="Answer three">Again</button>
                        <button onClick={() => buttonSelected('btn-4')}className="quiz-button" title="Answer four">Skip</button>
                    </div>
                    <div className="secondary-buttons-wrapper">
                      <Link to="/home"><button className="quiz-button secondary-button quit-button">Quit</button></Link>
                    </div>
                </div>
                <div className="quiz-panel-behind hide">
                    <div className="content-box text-content">
                        <h1>You have finished!</h1>
                        <p>You have completed the deck {courseName} Click here to return to your dashboard.</p>
                    </div>
                    <button className="white-button"><Link to="/home">Dashboard</Link></button>
                </div>
            </div>
        </main>
    </div>
  )
}
