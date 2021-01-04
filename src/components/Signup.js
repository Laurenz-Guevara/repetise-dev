import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Signup() {
  const emailRef = useRef()
  const userRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, userRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <div>
      <section className="login-container">
        <div className="form block">
        <form onSubmit={handleSubmit}>
          <h2 className="form-title">Sign Up</h2>
          {error && <h1>An error creating account</h1>}

          <div className="form-wrapper">
              <div className="form-container">
                <label htmlFor="email"><b>Email:</b></label>
                <input className="input-form" type="text" ref={emailRef} placeholder="Enter Email" name="email" required></input>
              </div>
              <div className="form-container">
                <label htmlFor="username"><b>Username:</b></label>
                <input className="input-form" type="text" ref={userRef} placeholder="Enter username" name="username" required></input>
              </div>
              <div className="form-container">
                <label htmlFor="psw"><b>Password:</b></label>
                <input className="input-form" type="password" ref={passwordRef} placeholder="Enter Password" name="psw" required></input>
              </div>
              <div className="form-container">
                <label htmlFor="psw"><b>Password</b></label>
                <input className="input-form" type="password" ref={passwordConfirmRef} placeholder="Enter Password again" name="psw" required></input>
              </div>
              <div className="form-secondary">
                <button className="button" disabled={loading} type="submit">Sign Up</button>
                <div className="forgot-pass">
                  <Link to="/forgot-password" className="login-link-text-password">Forgot Password?</Link>
                </div>
                <div className="already-signed-up">
                  <h2>Already have an account? <Link to="/login" className="login-link-text">Login</Link></h2>
                </div>
              </div>
            </div>         
        </form>
      </div>
    </section>
    </div>
  )
}
