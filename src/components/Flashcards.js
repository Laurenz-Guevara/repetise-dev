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

export default function Dashboard() {
  
  let [loading, setLoading] = useState(false);
  let [courseData, courseCard] = useState([])
  const [selected, selectedCourse] = useState([]);
  let [cards, addCards] = useState([])
  let { currentUser, logout } = useAuth()

  let [rcards, setReviewCards] = useState([])
  let [ncards, setNewCards] = useState([])

  let questionCount = 0;
  let quizButtons = ''
  let secondaryButtons = ''
  let questionCounter = document.querySelector('.question-count')
  
  let quizTitle = document.querySelectorAll('.quiz-title h1')
  let targetWord = document.querySelector('.target-word')

  
  
  let weight = 0
  let lgth = 0
  let shuffled = []

  function getCourseCard() {
    let itemContentViewer = []

    courseName = JSON.parse(localStorage.getItem('course'))
    let ref = firebase.firestore().collection("courses").where("courseName", "==", courseName)
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      })
      courseCard(items);
      setLoading(false);
    })

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
    let maxNewCards = 0
    newCard.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
          if (maxNewCards < 10) {
            maxNewCards++
            setNewCards(items)
          } else {
            console.log("No cards left")
          }
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
    shuffled = []
    shuffled = ncards.filter(val => !rcards.includes(val));
    shuffled = shuffleArray(shuffled)

    shuffled.map((card) => {
      reviewDate.push(card['review-date'])
      reviewStatus.push(card['review-status'])
      pronunciation.push(card['pronunciation'])
      translatedMeaning.push(card['translatedMeaning'])
      translatedWord.push(card['translatedWord'])
    })
    weight = 0;
    loadQuestion();
  }

  function loadQuestion() {
    document.querySelector(".quiz-panel").classList.add("display-quiz")
    document.querySelector(".quiz-answer").classList.add("hide")
    document.querySelector(".quiz-answer").classList.remove("display-quiz")
    
    if (questionCount < translatedWord.length) {
      console.log(translatedWord, "Translated")
      console.log(pronunciation, "Translated")
      questionCounter = document.querySelector('.question-count')
      questionCounter.innerText = `Card: ${questionCount + 1} out of ${translatedWord.length}`;
      targetWord.innerText = translatedWord[questionCount]
      
    } 
  }

  function buttonSelected(button) {
    let weight = 0
    switch(button) {
      case 'btn-1':
        console.log("Button 1")
        questionCount++
        loadQuestion()
        break;
      case 'btn-2':
        console.log("Button 2")
        questionCount++
        loadQuestion()
        break;
      case 'btn-3':
        console.log("Button 3")
        questionCount++
        loadQuestion()
        break;
      case 'btn-4':
        console.log("Button 4")
        questionCount++
        loadQuestion()
        break;
      case 'answer':
        //Make word same on back of card etc

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
        console.log("None selected")
        break;
    }
  }

  function startButton() {
    quizButtons = document.querySelectorAll('.quiz-button')
    secondaryButtons = document.querySelectorAll('.secondary-button')
    
    quizTitle = document.querySelector('.quiz-title h1')
    targetWord = document.querySelector('.target-word')

    document.querySelector(".quiz-panel").classList.add("display-quiz")
    document.querySelector(".quiz-start-screen").classList.add("hide")
    //document.querySelector(".quiz-answer").classList.add("hide")

    if (localStorage && localStorage.getItem('course')) {
      selectedCourse(courseName)
      quizTitle.textContent = courseName
      generateCard()
    }
    else {
      selectedCourse('None Selected')
    }
  }

  function quitQuiz() {
    console.log("Quiz Quit")
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
          <Link to="/" className="header-element"><h1>Repetise</h1></Link>
          <Link to="/" className="header-element"><h1>Home</h1></Link>
          <Link to="/stats" className="header-element"><h1>Stats</h1></Link>
          <Link to="/courses" className="header-element"><h1>Courses</h1></Link>
        </div>
      </div>
      <main className="main-section">
            <div className="flashcard-quiz-wrapper">
                <div className="quiz-start-screen">
                    <div className="content-box text-content">
                        <h1>Repetise Flashcards</h1>
                        <p>Please look at the card and select the option that best suits your perception of the word. If you did not recall the card correctly please select "Again".</p>
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
                        <h1 className='target-word'>你好</h1>
                    </div>
                    <div className="answers-wrapper">
                        <button onClick={() => buttonSelected('answer')} className="quiz-button" title="Show Answer">Show Answer</button>
                    </div>
                    <div className="secondary-buttons-wrapper">
                      <Link to="/"><button className="quiz-button secondary-button quit-button">Quit</button></Link>
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
                        <p className='pinyin'>nǐ hǎo</p>
                        <h1 className='target-word target-back'>你好</h1>
                        <div class="spacer"></div>
                        <p className='translation'>Translation</p>
                        
                    </div>
                    <div className="answers-wrapper">
                        <button onClick={() => buttonSelected('btn-1')}className="quiz-button" title="Answer one">Easy</button>
                        <button onClick={() => buttonSelected('btn-2')}className="quiz-button" title="Answer two">Hard</button>
                        <button onClick={() => buttonSelected('btn-3')}className="quiz-button" title="Answer three">Again</button>
                        <button onClick={() => buttonSelected('btn-4')}className="quiz-button" title="Answer four">Skip</button>
                    </div>
                    <div className="secondary-buttons-wrapper">
                      <Link to="/"><button className="quiz-button secondary-button quit-button">Quit</button></Link>
                    </div>
                </div>

                {/* <div className="quiz-panel-behind hide">
                    <div className="content-box text-content">
                        <h1>You have finished!</h1>
                        <p>You have completed the deck and your score is displayed below. If you are having trouble with words go to the Wordlist section and search for the incorrect ones.</p>
                        <p className="counters score-count final-score">Correct: 0</p>
                    </div>
                    <button className="white-button" id="restart">Restart</button>
                </div> */}
            </div>
        </main>
    </div>
  )
}

  // function loadDeckIntoUser(elementId){
  //   console.log("ELEMENT", elementId)

  //     ref = firebase.firestore().collection("courses").where("courseName", "==", courseName)

  //     firebase.firestore().collection("courses").doc("HSK1").onSnapshot((doc) => {
  //       const items = [];
  //       items.push(doc.data());
  //       const loadReference = firebase.firestore().collection("courses").doc("HSK1")
  //     })

  //     const loadReference = firebase.firestore().collection("userData").doc(currentUser.uid)
  //       return loadReference.set({
  //         enrolledCourses: ['native'],
  //         userName: username,
  //         userEmail: email,
  //         userPremium: false,
  //         userScore: 0,
  //       });
  //     });

  //     const reference = firebase.firestore().collection("userData").doc(currentUser.uid);
  //   return reference.update({
  //     enrolledCourses: enrolledCourses
  //   })
  // }