import React from 'react'
import NavBar from '../components/segments/NavBar';
import { Link } from 'react-router-dom'
import RepitiseAppImage from '../Repitise-Phone-Mockup.png';
import '../styles/wrapper.scss';
import '../styles/splash-page-hero.scss';

export default function Welcome() {
  return (
    <div>
      <NavBar />
      <section className="hero-container skewed-header">
        <div className="splash-text splash-wrapper">
          <div className="flex-container">
            <h1>A place for all your language flashcards.</h1>
            <h3>Create, store and share your favourite flashcard decks.</h3>
          </div>
          <div className="repitise-image">
            <img src={RepitiseAppImage} alt="Repitise picture of app"></img>
          </div>
          <div className="cta-button-container">
          <Link to="/signup">
            <button className="button">
              <h3>Sign up!</h3>
            </button>
          </Link>
        </div>
        </div>
      </section>
    </div>
  )
}
