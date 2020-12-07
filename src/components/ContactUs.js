import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/contact.scss';

export default function ContactUs() {
  return (
    <div>
      <section className="login-container">
        <form>
          <div className="form block">
              <h2 className="form-title">Contact</h2>
              <div className="form-wrapper">
                <div className="form-container">
                  <label htmlFor="email"><b>Email:</b></label>
                  <input disabled className="input-form contact-form" type="text" value="laurenzguevara@outlook.com" name="email"></input>
                </div>
                <div className="form-secondary">
                  <Link to="/" className="button contact-button ">Return</Link>
                </div>
              </div>
          </div>
        </form>
      </section>
    </div>
  )
}
